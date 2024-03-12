import z from "zod";

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result") as HTMLDivElement;
const sound = document.getElementById("sound") as HTMLAudioElement;
const btn = document.getElementById("search-btn") as HTMLButtonElement;

let inpWord = document.getElementById("inp-word") as HTMLInputElement;

const WordScheme = z.object({
  word: z.string(),
  phonetic: z.string(),
  phonetics: z.array(
    z.union([
      z.object({ text: z.string(), audio: z.string() }),
      z.object({ text: z.string() }),
    ])
  ),
  origin: z.string(),
  meanings: z.array(
    z.object({
      partOfSpeech: z.string(),
      definitions: z.array(
        z.object({
          definition: z.string(),
          example: z.string(),
          synonyms: z.array(z.string()),
          antonyms: z.array(z.string()),
        })
      ),
    })
  ),
});

type WordType = z.infer<typeof WordScheme>;

async function getData(word: string) {
  const response = await fetch(`${url}${word}`);
  if (!response.ok) {
    throw new Error("something went wrong");
  } else {
    return WordScheme.parse(await response.json());
  }
}

btn.addEventListener("onclick", async (event) => {
  event.preventDefault();

  const word = inpWord.value;

  if (word) {
    try {
      const WordData = await getData(word);
      displayWordInfo(WordData);
    } catch (error) {
      console.error(error);
    }
  }
});

function displayWordInfo(data: WordType) {
  result.innerHTML = ` <div class="word">
  <h3>${data.word}</h3>
  <button>
    <i class="fa-solid fa-music"></i>
  </button>
</div>
<div class="details">
  <p>pos</p>
  <p>/sample/</p>
</div>
<p class="word-meaning">
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
  excepturi dolores eum repellat sunt maiores eius corporis reiciendis
  sequi molestias. Labore earum illo, sunt nobis a omnis quisquam
  accusamus facilis.
</p>
<p class="word-example">
  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias,
  velit?
</p>
</div>`;
}
