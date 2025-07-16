import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function Header(props) {
  return (
    <header
      onClick={(e) => {
        e.preventDefault();
        props.onChangeMode();
      }}
    >
      <h1>
        <a href="/">{props.title}</a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const array = [];
  for (let i = 0; i < props.topics.length; i++) {
    let topic = props.topics[i];
    array.push(
      <li key={topic.id}>
        <a
          id={topic.id}
          href={"/read/" + topic.id}
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode(topic.id);
          }}
        >
          {topic.title}
        </a>
      </li>
    );
  }

  return (
    <nav>
      <ol>{array}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2> {props.title} </h2>
      {props.body}
    </article>
  );
}

function App() {
  const [mode, setMode] = useState("Welcome");
  const [id, setId] = useState(null);

  const topics = [
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ];

  let content = null;
  if (mode === "Welcome") {
    content = <Article title="Welcome" body="hello, web!" />;
  } else {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(id);
      if (topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
    }
    content = <Article title={title} body={body} />;
  }

  return (
    <div className="App">
      <div></div>
      <Header
        title="React"
        onChangeMode={() => {
          setMode("Welcome");
        }}
      />
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("Read");
          setId(_id);
        }}
      />
      {content}
    </div>
  );
}

export default App;
