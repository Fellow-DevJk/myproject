## Licensing and Terms of Use 📜

This project leverages several open-source libraries and pre-trained models. Adherence to their respective licenses is crucial. Copies of the licenses for the primary third-party dependencies are included in the `LICENSES/` directory of this repository.

**1. Core Python Libraries:**

The core Python libraries used (including PyTorch, torchvision, scikit-learn, Pandas, NumPy, FastAPI, Uvicorn, PyYAML, Pydantic, FAISS-CPU, OpenCV-Python-Headless, ONNX Runtime) are generally licensed under permissive open-source licenses such as **MIT** or **BSD-3-Clause**, which typically allow for both academic and commercial use. Please refer to the files within the `LICENSES/` directory for the full text and copyright notices.

**2. InsightFace Components:**

* **InsightFace Code:** The InsightFace Python library code itself is released under the **MIT License**, permitting commercial use.
* **InsightFace Pre-trained Models (CRITICAL LIMITATION):** The pre-trained models provided by InsightFace used in this Stage 1 prototype (including `det_10g.onnx`, `2d106det.onnx`, and `w600k_r50.onnx` from the `buffalo_l` package, as well as the `.pth` checkpoints potentially derived from them) are made available by InsightFace strictly for **non-commercial research purposes only**. Their use in operational government or commercial systems is **prohibited** under their current license.  (See: [InsightFace GitHub](https://github.com/deepinsight/insightface) for details).

**3. Training Data (VGGFace2):**

The model checkpoint (`iresnet100_final.pth`) provided or reproducible via the scripts in this repository was trained using the **VGGFace2 dataset**. VGGFace2 is licensed for **non-commercial research purposes only**.

**4. Compliance Plan for Future Deployment (Stage 3):**

Given the non-commercial restrictions on the currently used pre-trained models and training data, **any potential Stage 3 production deployment of this system will require replacing or retraining the core AI models**. This will involve utilizing commercially licensed model weights and/or training datasets provided or approved by the Government of India with appropriate usage rights to ensure full compliance for operational use. This plan ensures that the final deployed system adheres to all licensing requirements.

**5. Project Code:**

The code specific to this project repository is released under the [Your Chosen License - e.g., MIT License - Link to LICENSE file]. *(Self-correction: We need to finalize the LICENSE file)*.
