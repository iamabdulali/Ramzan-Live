
let submitBtn = document.querySelector("#btn");
let suratName = document.querySelector(".surat-name");
let sabaqNumber = document.querySelector(".sabaq-number");
let crossBtn = document.querySelector(".cross-symbol");
let popUp = document.querySelector(".popup");
let overlay = document.querySelector(".overlay");

function closePopandOverlay(params) {
  overlay.style.display = "none";
  popUp.style.display = "none";
}

crossBtn.addEventListener("click", () => {
  closePopandOverlay();
});

document.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "block";
  popUp.style.display = "flex";
});

overlay.addEventListener("click", () => {
  closePopandOverlay();
});


function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top > 0 &&
    rect.left >= 0 &&
    rect.bottom <
      (window.innerHeight || document.documentElement.clientHeight) -
        (window.innerHeight || document.documentElement.clientHeight) * 0.18 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function update(chunks, currentActive) {
  chunks.forEach((circle, idx) => {
    if (idx < currentActive) {
      circle.classList.add("active");
      if (!isElementInViewport(circle)) circle.scrollIntoView(true);
    } else {
      circle.classList.remove("active");
    }
  });
}


submitBtn.addEventListener("click", () => {
  closePopandOverlay();
});



function toArabicNumeral(num) {
  const arabicNums = {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩",
  };

  return String(num).replace(/[0-9]/g, function (w) {
    return arabicNums[w];
  });
}

function toRegularNumeral(num) {
  const regularNums = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return num
    .split("")
    .map((digit) => regularNums[digit])
    .join("");
}

const form = document.querySelector("#filter-form");
const filteredDataDiv = document.querySelector(".content-div");
let activeIndex = 0;
let arr = [];
let index = 0;
var baseUrl = window.location.host

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const juzNo = document.querySelector("#juz-no").value;
  sabaqNumber.textContent = `جزء : ${juzNo}`;

  fetch(`https://zikra.onrender.com/filter?juzNo=${juzNo}`)
    .then((response) => response.json())
    .then((data) => {
      const filteredData = data.map((item) => {
        const ayahNo = item[10];
        const ayahText = item[12];
        const surahName = item[5];
        arr.push(surahName);
        const words = ayahText.split(" ");
        const wordSpans = words.map(
          (word) => `<span class = chunk>${word}</span>`
        );
        const ayahHtml =
          wordSpans.join(" ") +
          ` <span class = "chunk ayahStop" >${toArabicNumeral(ayahNo)}</span>`;
        return ayahHtml;
      });
      const filteredDataHtml = filteredData.join("");
      filteredDataDiv.innerHTML = filteredDataHtml;
      suratName.textContent = `سورة : ${arr[0]} `;

      const allSpanTags = document.querySelectorAll(".chunk");
      allSpanTags[activeIndex].classList.add("active");
      activeIndex++;
      document.addEventListener("keydown", (e) => {
        if (e.keyCode == 37) {
          if (activeIndex <= allSpanTags.length - 1)
            allSpanTags[activeIndex].classList.add("active");
          activeIndex++;
          update(allSpanTags, activeIndex);
          const activeAyahStops = document.querySelectorAll(".ayahStop.active");
          const numActiveAyahStops = activeAyahStops.length;

          suratName.textContent = `سورة : ${arr[numActiveAyahStops]} `;
        }
        if (e.keyCode == 39) {
          if (activeIndex > 0) {
            allSpanTags[activeIndex].classList.remove("active");

            activeIndex--;
            update(allSpanTags, activeIndex);
          }
        }
      });
    })
    .catch((error) => console.error(error));
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 187) {
    var el = document.querySelectorAll(".chunk");
    el.forEach((el) => {
      var style = window
        .getComputedStyle(el, null)
        .getPropertyValue("font-size");
      var fontSize = parseFloat(style);
      el.style.fontSize = fontSize + 5 + "px";
    });
  }
  // now you have a proper float for the font size (yes, it can be a float, not just an integer)
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 189) {
    var el = document.querySelectorAll(".chunk");
    el.forEach((el) => {
      var style = window
        .getComputedStyle(el, null)
        .getPropertyValue("font-size");
      var fontSize = parseFloat(style);
      el.style.fontSize = fontSize - 5 + "px";
    });
  }
});