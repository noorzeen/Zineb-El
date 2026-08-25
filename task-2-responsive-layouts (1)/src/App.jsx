import "@fontsource/lato"
import "@fontsource/teko"
import "./App.css"

const movies = [
  {
    title: "Who Framed Roger Rabbit (1988)",
    image: "who-framed-roger-rabbit.jpg",
    text: "In a world where cartoons and humans coexist, a detective must solve a zany, high-stakes mystery. Packed with wild humor, groundbreaking animation, and noir twists, this unique film will pull you into a world where anything is possible!"
  },
  {
    title: "Hook (1991)",
    image: "hook.jpg",
    text: "Rediscover Neverland in this thrilling twist on Peter Pan! Robin Williams stars as a grown-up Peter, who must rediscover his inner child to rescue his kids from the clutches of Captain Hook. Adventure, magic, and nostalgia blend in this timeless family classic."
  },
  {
    title: "La La Land (2016)",
    image: "la-la-land.jpg",
    text: "Love, dreams, and the magic of LA take center stage in this musical masterpiece. Watch as two starry-eyed artists navigate passion and ambition in a world where every moment feels like a cinematic spectacle!"
  },
  {
    title: "Hidden Figures (2016)",
    image: "hidden-figures.jpg",
    text: "Three unsung heroes of NASA's space race take the spotlight in this inspiring true story. Battling discrimination and defying the odds, these brilliant African-American women prove that intelligence, perseverance, and unity can change history and break barriers."
  },
  {
    title: "Palm Springs (2020)",
    image: "palm-springs.jpg",
    text: "A never-ending wedding day turns into an unforgettable time-loop romance! Stuck in the same day, two strangers find love, chaos, and meaning in the most unexpected ways."
  },
  {
    title: "Barbie (2023)",
    image: "barbie.jpg",
    text: "Step into the dazzling world of Barbie as she embarks on an unexpected journey from her perfect doll life to the real world. Filled with humor, heart, and empowering messages, this vibrant adventure redefines what it means to dream big!"
  }
]

function MovieCard({ title, image, text, cardClass }) {
  return (
    <article className={cardClass}>
      <img src={`/assets/${image}`} alt={`${title} movie poster`} />
      <div className="movie-content">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <button>Watch Now</button>
      </div>
    </article>
  )
}

function App() {
  return (
    <>
      <header>
        <h1>watch.it</h1>
        <nav>
          <a href="#action">Action</a>
          <a href="#comedy">Comedy</a>
          <a href="#romance">Romance</a>
          <a href="#drama">Drama</a>
        </nav>
        <button className="search-button">Search</button>
      </header>

      <main>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.title}
            title={movie.title}
            image={movie.image}
            text={movie.text}
            cardClass={index === 0 ? "movie-card featured" : index >= 3 ? "movie-card wide" : "movie-card"}
          />
        ))}
      </main>
    </>
  )
}

export default App
