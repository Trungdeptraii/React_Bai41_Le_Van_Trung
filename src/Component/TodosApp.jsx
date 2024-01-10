import React, { Component } from 'react'
import { toast } from 'react-toastify'

import style from '../assets/css/todos.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import TodoItem from './TodoItem'
import Loadding from './Loadding'

export default class TodosApp extends Component {
  constructor({App}){
    super();
    this.state = {
      todo: ''
    }
    this.todoList = App.state.todoList
    this.App = App
  }
  handleSubmit = async (e)=>{
    e.preventDefault();
    const apiKey = sessionStorage.getItem("apiKey");
    if(apiKey && this.state.todo){
      try {
        let url = 'https://api-todo-ebon.vercel.app/api/v1/todos'
        const res = await fetch(url , {
          method: 'POST',
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({todo: this.state.todo})
        })
        if(res.ok){
          this.setState({...this.state, ["todo"]: ""})
          await this.App.getTodo()
          this.setState({todo: ''})
          toast.success(`Đã thêm thành công !!!`);
        }
        else{
          toast.warning(` Chưa thêm được công việc - Hãy thử lại`)
        }
      } catch (error) {
        toast.error(` Có lỗi xảy ra - Kiểm tra lại`)
      }
    }else{
      toast.warning('Bạn cần thêm công việc !!!')
    }
  }
  handleChange = (e)=>{
    this.setState({...this.state, [e.target.name]: e.target.value})
  }
  render() {
    let App = this.props.App
    return (
      <main className={style["main-todos"]}>
      <div className="container">
        <div className={style["header"]}>
          <div className={style["action"]}>
            <div className={style["todos-title"]}>Wellcome to Todo App !</div>
            <form action="#" className={style["form"]} onSubmit={this.handleSubmit}>
              <input type="text" name='todo' placeholder='Nhập công việc ... ' onChange={this.handleChange} value={this.state.todo}/>
              <button>Thêm mới</button>
            </form>
          </div>
          <div className={style["content"]}>
            <div className={style["todo-item"]}>
              <TodoItem App={App}/>
            </div>
          </div>
        </div>
      </div>
    </main>
    )
  }
}

