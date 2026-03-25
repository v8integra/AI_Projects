import { hfInterference } from '@huggingface/inference'

const hf = new hfInterference(process.env.HF_TOKEN)

// First Call
// const textToGenerate = "The definition of machine learning inference is "

// const response = await hf.textGeneration({
//     inputs: textToGenerate,
//     model: ""
// })



// Second Call
// const textToClassify = "I just bought a new camera. It's the best camera I've ever owned!"

// const response = await hf.textClassification({
//     model: "distilbert-base-uncased-finetuned-sst-2-english",
//     inputs: textToClassify
// })

// console.log(response)

// const textToTranslate = "It's an exciting time to be an AI engineer"



//Third Call - translate
// const textTranslationResponse = await hf.translation({
//   model: 'facebook/mbart-large-50-many-to-many-mmt',
//   inputs: textToTranslate,
//   parameters: {
//       src_lang: "en_XX",
//       tgt_lang: "ur_PK"
//   }
// })

// const translation = textTranslationResponse.translation_text
// console.log("\ntranslation:\n")
// console.log(translation)



// Fourth Call - Text to Speech
// const text = "It's an exciting time to be an A.I. engineer."

// const response = await hf.textToSpeech({
//   inputs: text,
//   model: "espnet/kan-bayashi_ljspeech_vits"
// })

// console.log(response)

// const audioElement = document.getElementById('speech')
// const speechUrl = URL.createObjectURL(response)
// audioElement.src = speechUrl


// Fifth Call - image transforming
const model = "ghoskno/Color-Canny-Controlnet-model"

const oldImageUrl = "/old-photo.jpeg"
const oldImageResponse = await fetch(oldImageUrl)
const oldImageBlob = await oldImageResponse.blob()

const prompt = `An elderly couple walks together on a gravel path with green 
grass and trees on each side. Wearing neutral-colored clothes, they face away
 from the camera as they carry their bags.`

const newImageBlob = await hf.imageToImage({
  model: model,
  inputs: oldImageBlob,
  parameters: {
    prompt: prompt,
    negative_prompt: "Black and white photo. text, bad anatomy, blurry, low quality",
    // Between 0 and 1
    strength: 0.8,
  }
})

const newImageBase64 = await blobToBase64(newImageBlob)
const newImage = document.getElementById("new-image")
newImage.src = newImageBase64
