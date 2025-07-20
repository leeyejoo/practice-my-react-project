import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function Header({ title, onChangeMode }) {
  return (
    <header
      onClick={(e) => {
        e.preventDefault();
        onChangeMode();
      }}
    >
      <h1>
        <a href="/">{title}</a>
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
            props.onChangeMode(Number(event.target.id));
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

// create form
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea name="body" placeholder="body"></textarea>
        </p>
        <p>
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}

// update form
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onUpdate(title, body); // 트리거
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}

function App() {
  const [mode, setMode] = useState("Welcome");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ]);

  let content = null; // 내용
  let contextControl = null; // update 버튼 컨트롤

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

  if (mode === "Welcome") {
    content = <Article title="Welcome" body="hello, web!" />;
  } else if (mode === "Read") {
    content = <Article title={title} body={body} />;
    contextControl = (
      <>
        <li>
          <a
            href={"/update" + id}
            onClick={(e) => {
              e.preventDefault();
              setMode("Update");
            }}
          >
            Update{" "}
          </a>
        </li>
        <li>
          <input
            type="button"
            value="Delete"
            onClick={() => {
              const newTopics = [];
              // 삭제하려는 topic을 제외한 것만 새로 push 해줌
              // => 해당 topic은 삭제 됨 (제외)
              for (let i = 0; i < topics.length; i++) {
                if (topics[i].id !== id) {
                  newTopics.push(topics[i]);
                }
              }

              // state에 세팅
              setTopics(newTopics);
              setMode("Welcome");
              setId(null);
            }}
          />
        </li>
      </>
    );
  } else if (mode === "Create") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          // newTopic 세팅
          const newTopic = { id: nextId, title: _title, body: _body };

          // 현재 topics 복제 후 push
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);

          // Read 모드로 변경하여 방금 추가한 게시글 확인하기
          setMode("Read");
          setId(nextId); // 방금추가한 ID
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "Update") {
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(_title, _body) => {
          const newTopics = [...topics];
          const newTopic = { id: id, title: _title, body: _body };
          // id는 이미 상세 페이지에서 update 한 것이기 때문에
          // [id, setId] 안에 현재 id를 이미 담고 있다.

          // 1. 기존의 topic과 id가 일치하는 것을 찾기
          // 2. 일치하는 id의 title, body를 교체하기
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = newTopic;
              break;
            }
          }

          // Read 모드로 변경하여 방금 변경한 게시글 확인하기
          setTopics(newTopics);
          setMode("Read");
        }}
      ></Update>
    );
  }

  return (
    <div className="App">
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

      <li>
        <a
          href="/create"
          onClick={(e) => {
            e.preventDefault();
            setMode("Create");
          }}
        >
          Create{" "}
        </a>
      </li>
      {contextControl}
    </div>
  );
}

export default App;
