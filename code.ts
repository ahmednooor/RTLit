// "RTLit" is a Figma plugin that converts the Arabic/Persian/Urdu text into
// readable format as Figma currently does not support RTL languages.
// author: ahmed noor (github.com/ahmednooor)

const SPECIAL_CHARS = {
  // diacritics etc.
  "\u064B": "",
  "\u064C": "",
  "\u064D": "",
  "\u064E": "",
  "\u064F": "",
  "\u0650": "",
  "\u0651": "",
  "\u0652": "",
  "\u0653": "",
  "\u0654": "",
  "\u0655": "",
  "\u0656": "",
  "\u0657": "",
  "\u0658": "",
};

const LTR_CHARS =
  "" +
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  ".,1234567890/*-+_=\\!@#$%^&*;?`~ ()[]{}<>|";

function isPersoArabicLTRChar(char: string): boolean {
  // tells you if its numeric etc. since numbers are LTR in arabic
  return (
    (char.codePointAt(0) > 1775 && char.codePointAt(0) < 1786) ||
    (char.codePointAt(0) > 1631 && char.codePointAt(0) < 1646)
  );
}

function isLTRChar(char: string): boolean {
  return LTR_CHARS.includes(char) || isPersoArabicLTRChar(char);
}

function containsPersoArabicChars(text: string): boolean {
  for (const char of text) {
    const charCode = char.codePointAt(0);

    /* start/end codes (converted from hex to dec versions of unicode)
      courtesy for unicode hex codes:
      https://en.wikipedia.org/wiki/Arabic_script_in_Unicode */
    const isArabic = charCode >= 1536 && charCode <= 1791;
    const isArabicSupplement = charCode >= 1872 && charCode <= 1919;
    const isArabicExtendedA = charCode >= 2208 && charCode <= 2303;
    const isArabicPresentFormA = charCode >= 64336 && charCode <= 65023;
    const isArabicPresentFormB = charCode >= 65136 && charCode <= 65279;
    const isRumiNumeral = charCode >= 69216 && charCode <= 69247;
    const isIndicSiyaq = charCode >= 126064 && charCode <= 126143;
    const isOttomanSiyaq = charCode >= 126208 && charCode <= 126287;
    const isArabicMathAlphabet = charCode >= 126464 && charCode <= 126719;

    if (
      isArabic ||
      isArabicSupplement ||
      isArabicExtendedA ||
      isArabicPresentFormA ||
      isArabicPresentFormB ||
      isRumiNumeral ||
      isIndicSiyaq ||
      isOttomanSiyaq ||
      isArabicMathAlphabet
    ) {
      return true;
    }
  }
  return false;
}

function offsetSpecialCharsForReversal(charStreamArr: string[]): string[] {
  /* make sure special chars such as diacritics shouldn't be reversed
       since they come after a char not before */
  for (let i = 1; i < charStreamArr.length; i++) {
    if (SPECIAL_CHARS[charStreamArr[i]] !== undefined) {
      const tempChar = charStreamArr[i - 1];
      charStreamArr[i - 1] = charStreamArr[i];
      charStreamArr[i] = tempChar;
    }
  }
  return charStreamArr;
}

function breakLTRAndRTLParts(charStreamArr: string[]): string[] {
  let brokenLTRAndRTLParts = [""];
  let LTRCharIndices = [];

  /* make sure LTR chars such as English or arabic numerals remain LTR */
  for (let i = 0; i < charStreamArr.length; i++) {
    if (isLTRChar(charStreamArr[i])) {
      LTRCharIndices.push(i);
      continue;
    }
    if (LTRCharIndices.length > 0) {
      brokenLTRAndRTLParts.push(
        charStreamArr.slice(LTRCharIndices[0], i).reverse().join("")
      );
      LTRCharIndices = [];
    }
    brokenLTRAndRTLParts[brokenLTRAndRTLParts.length - 1] += charStreamArr[i];
  }
  if (LTRCharIndices.length > 0) {
    brokenLTRAndRTLParts.push(
      charStreamArr
        .slice(LTRCharIndices[0], LTRCharIndices[LTRCharIndices.length])
        .reverse()
        .join("")
    );
    LTRCharIndices = [];
  }

  return brokenLTRAndRTLParts;
}

function main(figma: PluginAPI) {
  let taskPromises = [];
  let notificationHandler: NotificationHandler | null;

  if (figma.currentPage.selection.length < 1) {
    notificationHandler?.cancel();
    notificationHandler = figma.notify(
      "Please select a text box that contains Perso-Arabic text " +
        "and re-run the plugin.",
      { error: true }
    );
  }

  for (let node of figma.currentPage.selection) {
    if (node.type !== "TEXT") {
      notificationHandler?.cancel();
      notificationHandler = figma.notify(
        "Please select a text box that contains Perso-Arabic text " +
          "and re-run the plugin.",
        { error: true }
      );
      continue;
    }

    if (node.type === "TEXT" && !containsPersoArabicChars(node["characters"])) {
      notificationHandler?.cancel();
      notificationHandler = figma.notify(
        "The selected text box does not contain Perso-Arabic text. " +
          "Please try again with Perso-Arabic text.",
        { error: true }
      );
      continue;
    }

    taskPromises.push(
      figma
        .loadFontAsync({
          family: node.fontName["family"],
          style: node.fontName["style"],
        })
        .then((_) => {
          // console.log(node["characters"].length);
          let finalStream = [];
          for (let charStream of node["characters"].split("\n")) {
            let charStreamArr = offsetSpecialCharsForReversal(
              charStream.split("")
            );
            let brokenLTRAndRTLParts = breakLTRAndRTLParts(charStreamArr);
            charStream = brokenLTRAndRTLParts.join("");

            /* simple case of single-line. reverse all chars */
            if (node["textAutoResize"] === "WIDTH_AND_HEIGHT") {
              finalStream.push(charStream.split("").reverse().join(""));
              continue;
            }

            /* complex case of multi-line. 
                     reverse in a way that is readable from top to bottom */
            let tempNode = node.clone();
            tempNode["characters"] = charStream.split(" ")[0];
            tempNode["textAutoResize"] = "HEIGHT";
            let tempNodeInitialHeight = tempNode["height"];
            let linesArr = [];
            tempNode["characters"] = "";

            for (const char of charStream) {
              tempNode["characters"] = char + tempNode["characters"];

              if (tempNode["height"] > tempNodeInitialHeight) {
                let charStreamToPush = tempNode["characters"];
                let charStreamToPushWords = charStreamToPush.split(" ");

                if (charStreamToPushWords.length > 1) {
                  tempNode["characters"] = charStreamToPushWords[0];
                  charStreamToPush = charStreamToPushWords
                    .slice(1, charStreamToPushWords.length)
                    .join(" ");
                } else {
                  tempNode["characters"] = charStreamToPush.substring(0, 1);
                  charStreamToPush = charStreamToPush.substring(
                    1,
                    charStreamToPush.length
                  );
                }
                linesArr.push(charStreamToPush);
              }
            }
            linesArr.push(tempNode["characters"]);
            charStream = linesArr.join("\n");

            finalStream.push(charStream);
            tempNode.remove();
          }
          node["characters"] = finalStream.join("\n");
          // console.log(node["characters"].length);

          notificationHandler?.cancel();
          notificationHandler = figma.notify(
            "Text Updated. Press Ctrl+z to undo."
          );
        })
        .catch((_) => {
          notificationHandler?.cancel();
          notificationHandler = figma.notify(
            "Sorry! Couldn't load the selected font.",
            {
              error: true,
            }
          );
        })
    );
  }

  Promise.all(taskPromises).then((_) => figma.closePlugin());
}

main(figma);
