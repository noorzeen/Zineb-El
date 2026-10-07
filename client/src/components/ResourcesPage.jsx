import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, BookOpenCheck, CheckCircle2, ChevronDown, ChevronUp, Clock3, Code2, Lightbulb, ListPlus } from "lucide-react";

const lesson = (title, explanation, example) => ({ title, explanation, example });

const subjects = [
  {
    id: "web-development", title: "Web Development", text: "Build responsive applications with React and Express.", image: "/images/web-development.png", colour: "violet",
    chapters: [
      { title: "React Components", time: "20 min", summary: "Learn how reusable components divide an interface into manageable sections.", lessons: [
        lesson("Create and export a component", "A component is a reusable JavaScript function that returns JSX. Give it a capital-letter name so React recognises it as a component.", "export default function Welcome() {\n  return <h2>Welcome to StudyBuddy</h2>;\n}"),
        lesson("Pass information using props", "Props let a parent component send information to a child. They make one component reusable with different content.", "function SubjectCard({ title }) {\n  return <h3>{title}</h3>;\n}\n\n<SubjectCard title=\"Databases\" />"),
        lesson("Render components inside App.jsx", "Import a component, then use it like an HTML element. App can combine several small components into one complete page.", "import Welcome from './Welcome.jsx';\n\nfunction App() {\n  return <main><Welcome /></main>;\n}")
      ]},
      { title: "State and Events", time: "25 min", summary: "Use state to store changing information and events to respond to the user.", lessons: [
        lesson("Use the useState hook", "State is information that can change while the app is open. useState returns the current value and a function that safely updates it.", "const [count, setCount] = useState(0);\nsetCount(count + 1);"),
        lesson("Handle button and form events", "An event handler is a function that runs after an action such as a click, form submission or input change. Pass the function to onClick or onSubmit without calling it immediately.", "function handleClick() {\n  alert('Lesson started');\n}\n<button onClick={handleClick}>Start</button>"),
        lesson("Update the interface without refreshing", "When state changes, React renders the affected component again. The page updates immediately without a browser refresh.", "const [open, setOpen] = useState(false);\n<button onClick={() => setOpen(!open)}>Toggle</button>\n{open && <p>Now you can see me.</p>}")
      ]},
      { title: "Responsive Design", time: "20 min", summary: "Adapt layout, navigation and content for desktop and mobile screens.", lessons: [
        lesson("Use flexible grids", "CSS Grid can automatically divide available space. Flexible columns prevent cards from being fixed to one screen size.", ".cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}"),
        lesson("Add CSS media queries", "A media query applies different rules when the viewport reaches a chosen width. It is useful for changing columns and navigation on mobile.", "@media (max-width: 720px) {\n  .cards { grid-template-columns: 1fr; }\n}"),
        lesson("Test desktop and mobile layouts", "Test at several widths, not only one phone. Check text, buttons, forms, navigation, images and keyboard focus at each size.", "Desktop: 1440px\nTablet: 768px\nMobile: 375px")
      ]},
      { title: "Express API Routes", time: "30 min", summary: "Connect React to an Express server through meaningful HTTP requests.", lessons: [
        lesson("GET saved information", "A GET route returns data without changing it. React can request the route with fetch and display the returned JSON.", "app.get('/api/tasks', (req, res) => {\n  res.json(tasks);\n});"),
        lesson("POST new information", "A POST route receives data in req.body, validates it and creates a new record. A successful creation normally returns status 201.", "app.post('/api/tasks', (req, res) => {\n  const task = req.body;\n  res.status(201).json(task);\n});"),
        lesson("PATCH and DELETE information", "PATCH changes part of a record, while DELETE removes it. Both routes use a URL parameter such as :id to find the correct item.", "app.delete('/api/tasks/:id', (req, res) => {\n  // find owned task, then remove it\n  res.status(204).end();\n});")
      ]}
    ]
  },
  {
    id: "databases", title: "Databases", text: "Understand structured data, relationships and SQL.", image: "/images/coding-mentor.png", colour: "cyan",
    chapters: [
      { title: "Tables and Keys", time: "20 min", summary: "Organise records into tables and identify each row reliably.", lessons: [lesson("Choose suitable fields", "A field stores one type of fact about an entity. Use clear names and the smallest suitable data type.", "Student(id, name, email)"), lesson("Use primary keys", "A primary key uniquely identifies every row. It must not be duplicated or empty.", "student_id INTEGER PRIMARY KEY"), lesson("Understand foreign keys", "A foreign key stores the primary key of another table and creates a reliable relationship.", "task.owner_id → student.student_id")]},
      { title: "Entity Relationships", time: "25 min", summary: "Model how people, objects and transactions are connected.", lessons: [lesson("Identify entities", "An entity is a person, place, object or concept about which the system stores data.", "Student, Subject, Task"), lesson("Add relationships", "A relationship explains how two entities are connected and is usually represented using matching keys.", "Student creates Task"), lesson("Choose cardinality", "Cardinality states how many records can participate: one-to-one, one-to-many or many-to-many.", "One Student → many Tasks")]},
      { title: "SQL Queries", time: "30 min", summary: "Retrieve and change information using structured queries.", lessons: [lesson("SELECT and WHERE", "SELECT chooses columns and WHERE limits the rows returned by a query.", "SELECT title FROM tasks WHERE completed = false;"), lesson("INSERT and UPDATE", "INSERT creates a row. UPDATE changes existing rows and should normally include a WHERE condition.", "UPDATE tasks SET completed = true WHERE id = 4;"), lesson("DELETE safely", "DELETE removes matching rows. Check the WHERE condition first so you do not remove every record.", "DELETE FROM tasks WHERE id = 4;")]},
      { title: "Normalisation", time: "25 min", summary: "Reduce repeated data and improve database consistency.", lessons: [lesson("First normal form", "1NF requires atomic values: each cell contains one value and each row is unique.", "Do not store: 'React, SQL' in one subject cell"), lesson("Second normal form", "2NF means the table is in 1NF and every non-key field depends on the whole key.", "Move subject_name out of a task-subject join table"), lesson("Third normal form", "3NF removes indirect dependencies so non-key fields depend only on the primary key.", "Store tutor details in a Tutor table, not every Subject row")]}
    ]
  },
  {
    id: "software-engineering", title: "Software Engineering", text: "Plan, model, test and evaluate a software project.", image: "/images/presentation.png", colour: "orange",
    chapters: [
      { title: "Requirements", time: "20 min", summary: "Define what a system must do and the quality it must provide.", lessons: [lesson("Functional requirements", "Functional requirements describe behaviours or services the system must provide.", "The user can add and complete a study task."), lesson("Non-functional requirements", "Non-functional requirements describe qualities such as security, speed, accessibility and reliability.", "The layout must work at 375px width."), lesson("MoSCoW prioritisation", "MoSCoW separates Must, Should, Could and Won't-have features so the essential work is completed first.", "Must: login; Should: filters; Could: reminders") ]},
      { title: "User Stories", time: "20 min", summary: "Describe features from the perspective of a real user.", lessons: [lesson("Define the user", "Start with the person who benefits from the feature, not the developer or technology.", "As a university student…"), lesson("Describe the need", "State one clear action the user wants to complete.", "…I want to save a private task…"), lesson("Explain the benefit", "Finish with the reason the feature matters. This connects development to user value.", "…so that I can manage my deadlines.")]},
      { title: "UML Modelling", time: "30 min", summary: "Visualise actors, interactions and system behaviour before development.", lessons: [lesson("Use-case diagrams", "A use-case diagram shows actors and the goals they complete with the system.", "Student → Log in, Add task, Complete task"), lesson("Sequence diagrams", "A sequence diagram shows messages exchanged over time between the user interface, server and database.", "React → Express → data store → React"), lesson("Activity diagrams", "An activity diagram shows decisions and the flow from a starting action to an outcome.", "Login → valid? → dashboard / error") ]},
      { title: "Testing", time: "25 min", summary: "Check that requirements work and record evidence clearly.", lessons: [lesson("Choose test data", "Use normal, boundary and invalid data to see how the feature behaves in different situations.", "Valid email / blank email / malformed email"), lesson("Record expected and actual results", "Write the expected result before testing, then record what really happened.", "Expected: error shown. Actual: error shown."), lesson("Fix and retest", "A failed test should lead to a correction and another test. Keep evidence of both results.", "Fail → correction → retest → pass") ]}
    ]
  },
  {
    id: "code-lab", title: "Code Lab", text: "Practise programming logic and problem-solving skills.", image: "/images/harbour-exchange.png", colour: "pink",
    chapters: [
      { title: "Variables and Input", time: "15 min", summary: "Store values and collect information from a user.", lessons: [lesson("Select data types", "Choose a type that matches the value: strings for text, numbers for calculations and booleans for true/false state.", "const completed = false;"), lesson("Name variables clearly", "Descriptive camelCase names make code easier to understand and maintain.", "const studyDeadline = '2026-10-10';"), lesson("Validate user input", "Validation checks that input is present, correctly formatted and safe before it is processed.", "if (!title.trim()) showError();")]},
      { title: "Conditions", time: "20 min", summary: "Make a program choose different actions using Boolean decisions.", lessons: [lesson("Use if and else", "An if block runs when its condition is true; else provides an alternative path.", "if (score >= 40) pass(); else retry();"), lesson("Comparison operators", "Comparison operators create Boolean results. Use === for strict equality in JavaScript.", "deadline === today\nscore >= 40"), lesson("Combine conditions", "Use && when every condition is required and || when either condition is enough.", "if (loggedIn && isOwner) allowEdit();")]},
      { title: "Loops and Arrays", time: "30 min", summary: "Repeat instructions and process collections of data.", lessons: [lesson("Use for loops", "A for loop repeats code with a counter and is useful when you need an index.", "for (let i = 0; i < tasks.length; i++) { ... }"), lesson("Use array methods", "Modern array methods express common operations clearly: map transforms, filter selects and find returns one match.", "const openTasks = tasks.filter(task => !task.completed);"), lesson("Access array elements", "Array positions start at zero. Check that an item exists before using its properties.", "const firstTask = tasks[0];") ]},
      { title: "Functions", time: "25 min", summary: "Divide a program into reusable blocks with clear responsibilities.", lessons: [lesson("Use parameters", "Parameters are named inputs that let the same function work with different values.", "function greet(name) { return `Hello ${name}`; }"), lesson("Return values", "return sends a result back to the code that called the function and stops that function.", "function total(a, b) { return a + b; }"), lesson("Test one function at a time", "Give a function known inputs and compare its actual result with the expected result.", "total(2, 3) === 5 // expected true") ]}
    ]
  }
];

export default function ResourcesPage({ onNavigate, onPlanLesson }) {
  const [selectedId, setSelectedId] = useState("");
  const [openChapter, setOpenChapter] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("studybuddy-chapters") || "[]"));
  const selected = subjects.find((subject) => subject.id === selectedId);

  useEffect(() => localStorage.setItem("studybuddy-chapters", JSON.stringify(completed)), [completed]);
  const totalLessons = useMemo(() => subjects.reduce((total, subject) => total + subject.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0), 0), []);
  function openSubject(id) { setSelectedId(id); setOpenChapter(0); setActiveLesson(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function toggleComplete(subjectId, chapterIndex) { const key = `${subjectId}-${chapterIndex}`; setCompleted((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]); }

  if (selected && activeLesson) {
    const chapter = selected.chapters[activeLesson.chapterIndex];
    const current = chapter.lessons[activeLesson.lessonIndex];
    const previous = activeLesson.lessonIndex > 0 ? activeLesson.lessonIndex - 1 : null;
    const next = activeLesson.lessonIndex < chapter.lessons.length - 1 ? activeLesson.lessonIndex + 1 : null;
    return <section className="content-page lesson-page">
      <button className="back-to-subjects" onClick={() => setActiveLesson(null)}><ArrowLeft /> Back to {chapter.title}</button>
      <div className={`lesson-hero ${selected.colour}`}><div><span>{selected.title} · Chapter {activeLesson.chapterIndex + 1}</span><h1>{current.title}</h1><p>{chapter.summary}</p></div><BookOpen /></div>
      <div className="lesson-layout">
        <aside className="lesson-menu"><p>Lessons in this chapter</p>{chapter.lessons.map((item, index) => <button className={index === activeLesson.lessonIndex ? "active" : ""} onClick={() => setActiveLesson({ ...activeLesson, lessonIndex: index })} key={item.title}><span>{index + 1}</span>{item.title}</button>)}</aside>
        <article className="lesson-reader"><span className="lesson-label">Lesson {activeLesson.lessonIndex + 1} of {chapter.lessons.length}</span><h2>What does it mean?</h2><p>{current.explanation}</p><div className="example-box"><div><Code2 /> Practical example</div><pre><code>{current.example}</code></pre></div><div className="lesson-note"><Lightbulb /><p><strong>Remember:</strong> Try the example yourself, change one value, and observe what happens.</p></div><div className="lesson-actions"><button disabled={previous === null} onClick={() => setActiveLesson({ ...activeLesson, lessonIndex: previous })}><ArrowLeft /> Previous</button><button className="plan-lesson" onClick={() => onPlanLesson({ title: `Study: ${current.title}`, subject: selected.title, notes: `${chapter.title} — ${current.explanation}` })}><ListPlus /> Plan this lesson</button><button disabled={next === null} onClick={() => setActiveLesson({ ...activeLesson, lessonIndex: next })}>Next <ArrowRight /></button></div></article>
      </div>
    </section>;
  }

  if (selected) {
    const completedHere = selected.chapters.filter((chapter, index) => completed.includes(`${selected.id}-${index}`)).length;
    return <section className="content-page subject-detail-page">
      <button className="back-to-subjects" onClick={() => setSelectedId("")}><ArrowLeft /> All subjects</button>
      <div className="subject-hero"><img src={selected.image} alt="" /><div className="subject-hero-overlay" /><div><span>Interactive study pathway</span><h1>{selected.title}</h1><p>{selected.text}</p><div className="subject-meta"><span><BookOpenCheck /> {selected.chapters.length} chapters</span><span><BookOpen /> {selected.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)} lessons</span><span><CheckCircle2 /> {completedHere} completed</span></div></div></div>
      <div className="chapter-layout"><aside className="chapter-sidebar"><p>Course progress</p><strong>{Math.round((completedHere / selected.chapters.length) * 100)}%</strong><div className="chapter-progress"><span style={{ width: `${(completedHere / selected.chapters.length) * 100}%` }} /></div><small>{completedHere} of {selected.chapters.length} chapters completed</small><button onClick={() => onNavigate("tasks")}><ListPlus /> Open my study plan</button></aside>
        <div className="chapter-list">{selected.chapters.map((chapter, index) => { const isOpen = openChapter === index; const isComplete = completed.includes(`${selected.id}-${index}`); return <article className={`chapter-card ${isOpen ? "open" : ""} ${isComplete ? "complete" : ""}`} key={chapter.title}><button className="chapter-heading" onClick={() => setOpenChapter(isOpen ? -1 : index)}><span className="chapter-number">{isComplete ? <CheckCircle2 /> : String(index + 1).padStart(2, "0")}</span><span><small>Chapter {index + 1} · {chapter.lessons.length} lessons</small><strong>{chapter.title}</strong></span><span className="chapter-time"><Clock3 /> {chapter.time}</span>{isOpen ? <ChevronUp /> : <ChevronDown />}</button>{isOpen && <div className="chapter-content"><p>{chapter.summary}</p><h3>Choose a lesson</h3><div className="lesson-links">{chapter.lessons.map((item, lessonIndex) => <button key={item.title} onClick={() => { setActiveLesson({ chapterIndex: index, lessonIndex }); window.scrollTo({ top: 0, behavior: "smooth" }); }}><span>{lessonIndex + 1}</span><strong>{item.title}</strong><ArrowRight /></button>)}</div><button className="complete-chapter" onClick={() => toggleComplete(selected.id, index)}>{isComplete ? "Mark as not completed" : "Mark chapter completed"}</button></div>}</article>; })}</div>
      </div>
    </section>;
  }

  return <section className="content-page resources-page"><div className="page-title"><span><BookOpenCheck /></span><div><p>Interactive learning library</p><h1>Choose a subject and start studying</h1><small>{totalLessons} clickable lessons across four Computing subjects.</small></div></div><div className="resource-grid">{subjects.map((subject) => { const completedCount = subject.chapters.filter((chapter, index) => completed.includes(`${subject.id}-${index}`)).length; const lessonCount = subject.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0); return <article className={`resource-card ${subject.colour}`} key={subject.id}><div className="resource-art"><img src={subject.image} alt="" /><span>{lessonCount} lessons</span></div><div className="resource-body"><span>{completedCount} of {subject.chapters.length} chapters completed</span><h2>{subject.title}</h2><p>{subject.text}</p><button onClick={() => openSubject(subject.id)}>Open subject <ArrowRight /></button></div></article>; })}</div><article className="tip-banner"><Lightbulb /><div><strong>Every objective is now a lesson</strong><p>Open a chapter, choose a lesson, read the explanation and add it to your private study plan.</p></div></article></section>;
}
