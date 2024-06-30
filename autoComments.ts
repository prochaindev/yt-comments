require('dotenv').config();
const fs = require('fs').promises;

async function readFile(): Promise<string> {
  try {
    const data = await fs.readFile('./comments.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
    return '';
  }
}

// readFile().then(data=>{const sData = data.split('\n')
// console.log(sData)
// const slData = sData.slice(2,4)
// console.log(slData)
// const jData = slData.join('\n')
// console.log(jData)

//})

const addOrder = async (service: number, link: string, comments: string): Promise<void> => {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: process.env.API_SECRET,
      action: 'add',
      service,
      link,
      comments,
    }),
  };

  try {
    const response = await fetch(String(process.env.API_URL), requestOptions);
    console.log(await response.json());
  } catch (err) {
    console.error('Error making request:', err);
  }
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async (): Promise<void> => {
  
  const data = await readFile();
  const lines=data.split('\n')

  const runTimes = Number(process.env.SCRIPT_RUN_TIMES);
  const timeDelayInMinutes = Number(process.env.TIME_DELAY_IN_EACH_RUN);
  const timeDelayInMilliseconds = timeDelayInMinutes * 60 * 1000;
  const commentsPerRun = Number(process.env.COMMENTS_PER_RUN)

  let fromSlice=0, toSLice=commentsPerRun;

  for (let i = 0; i < runTimes; i++) {
    
    const slicedLines = lines.slice(fromSlice, toSLice)
    const comments = slicedLines.join('\n')
    console.log(comments)

    await addOrder(4794, String(process.env.VIDEO_LINK), comments);
    console.log(`Run: ${i + 1}, Waiting for ${timeDelayInMinutes} minutes`);
    await delay(timeDelayInMilliseconds);


    console.log(fromSlice, toSLice)
    fromSlice+=commentsPerRun
    toSLice+=commentsPerRun
  }
};

main().catch(err => console.error('Error in main function:', err));
