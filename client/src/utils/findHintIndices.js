import findQuestionIndices from "./findQuestionIndices";

const findHintIndices = (
  formattedAnswerArray,
  fullAnswerArray,
  anagramWords
) => {
  for (let i = 0; i < formattedAnswerArray.length; i++) {
    for (let j = 0; j < formattedAnswerArray[i].length; j++) {
      if (formattedAnswerArray[i][j] !== fullAnswerArray[i][j]) {
        let wrongLetter = formattedAnswerArray[i][j];
        let correctLetter = fullAnswerArray[i][j];
        // Find the word and letter index in the question of the correct letter
        const [disableWordIndex, disableLetterIndex] = findQuestionIndices(
          correctLetter,
          anagramWords
        );

        const output = [
          { answerWord: i, answerLetter: j, correctLetter },
          {
            disableWordIndex,
            disableLetterIndex,
            disableLetter: correctLetter,
          },
        ];
        // Check if there is a letter being replaced in the formattedAnswerArray, and push this into the output to reenable this button
        if (wrongLetter) {
          output.push(wrongLetter);
        }
        return output;
      }
    }
  }
};

export default findHintIndices;
