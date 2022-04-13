const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const songtxt = search.value.trim();

  if (!songtxt) {
    alert("Please Enter a song - an artist");
  } else {
    searchLyrics(songtxt);
  }
});

async function searchLyrics(song) {
  const res = await fetch(`${apiURL}/suggest/${song}`);
  const allSongs = await res.json();
  showData(allSongs);
  console.log(allSongs);
}

function showData(songs) {
  result.innerHTML = `
  <ul class="songs">
    ${songs.data
      .map(
        (song) =>
          `<li>
          <span>
        <strong>${song.artist.name}</strong> - ${song.title}
      </span>
      <button class="btn"
      data-artist="${song.artist.name}"
      data-song='${song.title}'
      >Lyric</button>
      </li>`
      )
      .join("")}
  </ul>`;

  if (songs.next || songs.prev) {
    more.innerHTML = `
    ${
      songs.prev
        ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">Previous</button>`
        : ""
    }
    ${
      songs.next
        ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Next</button>`
        : ""
    }
    `;
  } else {
    more.innerHTML = "";
  }
  // console.log(songs);
}

async function getMoreSongs(songsURL) {
  console.log(songsURL);
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsURL}`);
  const allSongs = await res.json();
  showData(allSongs);
}

result.addEventListener("click", (e) => {
  const clickEl = e.target;

  if (clickEl.tagName == "BUTTON") {
    const artist = clickEl.getAttribute("data-artist");
    const songName = clickEl.getAttribute("data-song");

    getLyrics(artist, songName);
  }
});

async function getLyrics(artist, songName) {
  const res = await fetch(`${apiURL}v1/${artist}/${songName}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  console.log(lyrics);

  if (lyrics) {
    result.innerHTML = `
    <h2><span>
        <strong>${artist}</strong> - ${songName}
      </span></h2>

      <span>${lyrics}</span>
    `;
  } else {
    result.innerHTML = `
    <h2><span>
        <strong>${artist}</strong> - ${songName}
      </span></h2>

      <span>This song doesn't have lyrics</span>
    `;
  }
  more.innerHTML = "";
}
