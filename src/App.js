import logo from './logo.svg';
import React from 'react';
import './App.css';
import {useQuery} from 'react-query'
import axios from 'axios'


class MyToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: ''};
    this.valChange = this.valChange.bind(this);
    this.valSubmit = this.valSubmit.bind(this);
    this.storeItems = this.storeItems.bind(this);
    this.getItems = this.getItems.bind(this);
 }

  render() {
    return (
      <div className="App-header">
      <h1>My Fancy To Do List</h1>
      <TodoList items={this.state.items} />
      <form onSubmit={this.valSubmit}>
       <label htmlFor="new-todo">
        What should we do next....?
       </label>
       <input
         id="new-todo"
         onChange={this.valChange}
         value={this.state.text}
        />
        <button>
          Add #{this.state.items.length +1}
        </button>
        <button onClick={this.storeItems}>
          Store {this.state.items.length} item list
        </button>
        <button onClick={this.getItems}>
          Retrieve last stored list
        </button>

      </form>
      </div>
    );
  }

  valChange(e) {
    this.setState({text: e.target.value})
  }

  valSubmit(e) {
    e.preventDefault();
    if(!this.state.text.length){
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }));
  }


  storeItems(e) {
    e.preventDefault();
    console.log("Storing items")
    var state = this.state;
    console.log(state)
    // First, clear the old list in the database:
    axios.delete("http://127.0.0.1:8000/api/todolist", { crossdomain: true }).then ((response) => {
      state.items.forEach( element =>
      {
        var requestURI = "http://127.0.0.1:8000/api/todolist?todoNumber=" + element.id + "&todoText=" + element.text
        console.log(requestURI)
        axios.post(requestURI)
      })

    })
  }

  getItems(e) {
    console.log("Getting items")
    e.preventDefault();
    var todos = "woop"
    var state = this.state;
    state.items = [];
    state.text = ''
    console.log(state.items)
    axios.get('http://127.0.0.1:8000/api/todolist').then((response) => {
      todos = response.data;
      console.log(todos)
      todos.forEach(element =>
        {
          const newItem = {
            text: element.todoText,
            id: Date.now()
          };
          state.items = state.items.concat(newItem);
          state.text = '';
        })
      console.log(state.items)
      this.setState(state)

      });
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map((item, index) => (
          <li key={index}>{item.text}</li>
        ))}
      </ul>
    );
  }
}

export default MyToDoList;
