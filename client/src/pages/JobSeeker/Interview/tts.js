/* export const speakText = (text) => {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
};
 */

export const speakText = (text) => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onend = () => {
      resolve(); // 👈 IMPORTANT
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
};
