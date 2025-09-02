import cv2
import numpy as np
import os
from skimage.feature import local_binary_pattern, graycomatrix, graycoprops
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pandas as pd

# ===============================
# Pré-processamento
# ===============================
def gray_world_wb(img_bgr):
    b, g, r = cv2.split(img_bgr.astype(np.float32))
    mean_b, mean_g, mean_r = b.mean(), g.mean(), r.mean()
    mean_gray = (mean_b + mean_g + mean_r) / 3.0
    b *= (mean_gray / (mean_b + 1e-6))
    g *= (mean_gray / (mean_g + 1e-6))
    r *= (mean_gray / (mean_r + 1e-6))
    out = cv2.merge([b, g, r])
    return np.clip(out, 0, 255).astype(np.uint8)

def clahe_on_L(img_bgr):
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    L, A, B = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    L2 = clahe.apply(L)
    return cv2.cvtColor(cv2.merge([L2, A, B]), cv2.COLOR_LAB2BGR)

def leaf_mask(img_bgr):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    low, high = (25, 30, 20), (100, 255, 255)
    mask = cv2.inRange(hsv, np.array(low), np.array(high))
    mask = cv2.medianBlur(mask, 5)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE,
                            cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))
    return mask

# ===============================
# Features
# ===============================
def lbp_histograms(gray, mask, radii=[1,3,5]):
    feats = []
    for r in radii:
        lbp = local_binary_pattern(gray, 8*r, r, method="uniform")
        masked = lbp[mask>0]
        hist, _ = np.histogram(masked, bins=np.arange(0, 8*r+3), range=(0, 8*r+2))
        hist = hist.astype("float")
        if hist.sum()>0: hist /= hist.sum()
        feats.extend(hist.tolist())
    return feats

def glcm_feats(gray, mask=None):
    if mask is not None:
        gray = cv2.bitwise_and(gray, gray, mask=mask)
    gray = cv2.equalizeHist(gray)
    glcm = graycomatrix(gray, [1,2,3], [0, np.pi/4, np.pi/2, 3*np.pi/4],
                        256, symmetric=True, normed=True)
    feats = []
    for prop in ['contrast','energy','homogeneity','correlation']:
        vals = graycoprops(glcm, prop).ravel()
        feats.append(vals.mean())
        feats.append(vals.std())
    P = glcm.astype(np.float64)
    P[P==0] = 1.0
    entropy = -np.sum(P * np.log(P), axis=(0,1))
    feats.append(float(entropy.mean()))
    feats.append(float(entropy.std()))
    return feats

def color_stats(img_bgr, mask):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    feats = []
    for space in [hsv, lab]:
        for i in range(3):
            vals = space[:,:,i][mask>0]
            feats.append(float(vals.mean()))
            feats.append(float(vals.std()))
    return feats

def gabor_energy(gray):
    energies = []
    for theta in [0, np.pi/4, np.pi/2, 3*np.pi/4]:
        kern = cv2.getGaborKernel((21,21), 4.0, theta, 10.0, 0.5, 0, ktype=cv2.CV_32F)
        f = cv2.filter2D(gray, cv2.CV_32F, kern)
        energies.append(np.mean(f**2))
    return float(np.mean(energies))

def powdery_features(img_bgr, gray, mask):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    V, S = hsv[:,:,2], hsv[:,:,1]
    highlight = ((V > 210) & (S < 40)).astype(np.uint8)*255
    highlight = cv2.bitwise_and(highlight, highlight, mask=mask)

    nlabels, labels, stats, _ = cv2.connectedComponentsWithStats(highlight)
    granular_area = 0
    granular_count = 0
    circ_list = []
    for i in range(1, nlabels):
        area = stats[i, cv2.CC_STAT_AREA]
        comp_mask = (labels==i).astype(np.uint8)*255
        vals = gray[comp_mask>0]
        var_local = np.var(vals)
        if var_local > 50:  # limiar para granularidade
            granular_area += area
            granular_count += 1
            x,y,w,h,_ = stats[i]
            circ = (4*np.pi*area) / ((2*(w+h))**2 + 1e-6)
            circ_list.append(circ)

    leaf_area = mask.sum() / 255
    if leaf_area == 0: leaf_area = 1
    perc_area = granular_area / leaf_area
    avg_area = (granular_area / granular_count) if granular_count>0 else 0
    avg_circ = np.mean(circ_list) if circ_list else 0
    return [perc_area, granular_count, avg_area, avg_circ], highlight

# ===============================
# Pipeline
# ===============================
DATASET_PATH = "dataset"
features, labels = [], []

# criar pastas para salvar imagens
os.makedirs("preproc", exist_ok=True)
os.makedirs("seg_textura", exist_ok=True)
os.makedirs("masks", exist_ok=True)
os.makedirs("powdery_masks", exist_ok=True)

for class_name in ["healthy","rust","powdery"]:
    folder = os.path.join(DATASET_PATH, class_name)
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        img = cv2.imread(path)
        if img is None: continue

        # pré-processamento
        img = gray_world_wb(img)
        img = clahe_on_L(img)
        mask = leaf_mask(img)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # salvar imagens pré-processadas
        cv2.imwrite(f"preproc/{class_name}_{file}", img)
        cv2.imwrite(f"masks/{class_name}_{file}", mask)
        lbp = local_binary_pattern(gray, 8*3, 3, method="uniform")
        lbp_norm = np.uint8(255 * lbp / lbp.max())
        cv2.imwrite(f"seg_textura/{class_name}_{file}", lbp_norm)

        # features
        f_lbp = lbp_histograms(gray, mask)
        f_glcm = glcm_feats(gray, mask)
        f_color = color_stats(img, mask)
        f_gabor = [gabor_energy(gray)]
        f_powder, highlight_mask = powdery_features(img, gray, mask)

        # salvar máscara de pó branco granular
        cv2.imwrite(f"powdery_masks/{class_name}_{file}", highlight_mask)

        feat_vec = f_lbp + f_glcm + f_color + f_gabor + f_powder
        features.append(feat_vec)
        labels.append(class_name)

# ===============================
# Classificação
# ===============================
X = np.array(features)
y = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf = RandomForestClassifier(n_estimators=800, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nMatriz de confusão:\n", confusion_matrix(y_test, y_pred))
print("\nRelatório de classificação:\n", classification_report(y_test, y_pred))
