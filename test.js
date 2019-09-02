let testArray = [1,2,3,4,5,6,7,8,9];

async function loop (data){
  for (let i = 0; i < data.length; i++) {
    await console(data[i]);
  }
};


function console(text) {
  return new Promise((resolve, reject) => {
    resolve(
      setTimeout((text) => {
      console.log(text);
    }, 5200)
  )});
};

loop(testArray);