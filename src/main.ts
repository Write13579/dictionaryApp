import z from "zod";

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result") as HTMLDivElement;
const sound = document.getElementById("sound") as HTMLAudioElement;
const btn = document.getElementById("search-btn") as HTMLButtonElement;
btn.onclick = Submit;
let inpWord = document.getElementById("inp-word") as HTMLInputElement;

const WordScheme = z.array(
  z.object({
    word: z.string(),
    phonetic: z.string().optional(),
    phonetics: z
      .array(
        z.object({
          text: z.string().optional(),
          audio: z.string().optional(),
        })
      )
      .optional(),
    origin: z.string().optional(),
    meanings: z.array(
      z.object({
        partOfSpeech: z.string(),
        definitions: z.array(
          z.object({
            definition: z.string(),
            example: z.string().optional(),
            synonyms: z.array(z.string()),
            antonyms: z.array(z.string()),
          })
        ),
      })
    ),
  })
);

type WordType = z.infer<typeof WordScheme>;

async function getData(word: string) {
  const response = await fetch(`${url}${word}`);
  if (!response.ok) {
    throw new Error("something went wrong");
  } else {
    return WordScheme.parse(await response.json());
  }
}

export async function Submit() {
  const word = inpWord.value;

  if (word) {
    try {
      const WordData = await getData(word);
      displayWordInfo(WordData);
    } catch (error) {
      console.error(error);
      result.innerHTML = `<h3>Could not find "${word}"</h3>`;
    }
  }
}

function displayWordInfo(data: WordType) {
  result.innerHTML = ` <div class="word">
  <h3>${data[0].word}</h3>
  <button id="playSoundBtn" onclick="playSound()">
    <i class="fa-solid fa-music"></i>
  </button>
</div>
<div class="details">
  <p>${
    data[0].meanings[0].partOfSpeech || "<i>idk what part of speech it is</i>"
  }</p>
  <p>${data[0].phonetic || "<i>no phonetic</i>"}</p>
</div>
<p class="word-meaning">
  ${data[0].meanings[0].definitions[0].definition}
</p>
<p class="word-example">
${data[0].meanings[0].definitions[0].example ?? "<i>no example</i>"}

</p>
</div>`;

  if (data[0].phonetics?.[0]?.audio !== "") {
    sound.setAttribute("src", data[0].phonetics?.[0]?.audio ?? ``);
  }
}

export function playSound() {
  sound.play();
}

(window as any).playSound = playSound;
