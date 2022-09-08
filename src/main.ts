import './style.css';

import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, increment, setDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from './firebaseConfig';

const RATING_KEY = "rating";
const RATING_DOC_KEY = "rating-key";

initializeApp(firebaseConfig);

window.addEventListener("load", () => {
  const radioInputs = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

  const initialRating = localStorage.getItem(RATING_KEY);
  if (initialRating) {
    const radioInput = document.querySelector(`input[value="${initialRating}"]`) as HTMLInputElement;
    radioInput.checked = true;
  }

  radioInputs.forEach(radioInput => {
    radioInput.addEventListener("change", () => {
      const db = getFirestore();
      const data = {
        rating: radioInput.value
      };
      const ratingId = localStorage.getItem(RATING_DOC_KEY);

      if (ratingId) {
        const ref = doc(db, "ratings", ratingId);

        updateDoc(ref, data).then(() => {
          localStorage.setItem(RATING_KEY, radioInput.value);
          localStorage.setItem(RATING_DOC_KEY, ref.id);
        }).catch((err) => console.log(err));
      } else {
        const ref = doc(collection(db, "ratings"));

        setDoc(ref, data).then(() => {
          localStorage.setItem(RATING_KEY, radioInput.value);
          localStorage.setItem(RATING_DOC_KEY, ref.id);
        }).catch((err) => console.log(err));
      }

    });
  });

  const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
  downloadBtn.addEventListener("click", async () => {
    const db = getFirestore();
    const ref = doc(db, "downloads", "downloads");

    await updateDoc(ref, {
      count: increment(1)
    }).then(() => {
      window.location.href = "/Killing Laplace's Demon.pdf";
    });
  });
});
