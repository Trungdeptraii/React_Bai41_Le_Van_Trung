// import React, { useEffect, useState } from 'react'
import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loadding from './Component/Loadding'
import TypeEmail from './Component/TypeEmail'
import TodosApp from './Component/TodosApp';

// function App() {
//   let [isLoadding, setIsLoadding] = useState(true);
//   let [showTodo, setShowTodo] = useState(false);
//   useEffect(()=>{
//     const handleLogin = async ()=>{
//       const apiKey = sessionStorage.getItem("apiKey")
//       try {
//         if(apiKey){
//           const name = sessionStorage.getItem("name")
//           const res = await fetch('https://api-todo-ebon.vercel.app/api/v1/todos', {
//             method: 'GET',
//             headers: {
//               "X-Api-Key": apiKey,
//             }
//             })
//           if(res.ok){
//             setShowTodo(true)
//             toast.success(` Chào mừng ${name} đã quay trở lại`);
//             console.log('data',await res.json());
//           }else{
//             setShowTodo(false)
//           }
//           setIsLoadding(false)
//         }else{
//           setIsLoadding(false)
//         }
//       } catch (error) {
//         setIsLoadding(false)
//       }
//     }  
//     handleLogin()
//   }, [])
//   return (
//     <div>
//       {
//         !showTodo && !isLoadding ? < TypeEmail handleEmail={setShowTodo}/> : ''
//       }
//       {
//         showTodo ? <TodosApp/> : ''
//       }
//       {
//         isLoadding ? <Loadding /> : ''
//       }
//       <ToastContainer autoClose={1000}/>
//     </div>
//   )
// }
// export default App

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      showTodo: false,
      isLoading: true,
      todoList: []
    }
    this.idRemove = undefined;
  }
  handleLogin = async ()=>{
    const apiKey = sessionStorage.getItem("apiKey")
    if(apiKey){
      const name = sessionStorage.getItem("name")
      try {
        const res = await fetch('https://api-todo-ebon.vercel.app/api/v1/todos', {
          method: 'GET',
          headers: {
            "X-Api-Key": apiKey,
          }
        })
        if(res.ok){
          let todoList = await res.json();
          toast.success(` Chào mừng ${name} đã quay trở lại`);
          this.setState({["isLoading"]: false, ["showTodo"]: true, ["todoList"]: todoList.data});
        }else{
          this.setState({["isLoading"]: false, ["showTodo"]: false})
        }
      } catch (error) {
        this.setState({...this.state, ["isLoading"]: false})
      }
    }else{
      this.setState({...this.state, ["isLoading"]: false})
    }
  }  
  componentDidMount(){
    this.handleLogin();
    toast.onChange((payLoad)=>{
      if(payLoad.status == 'added' && payLoad.data.type == 'delete'){
        this.id = payLoad.data.id;
      }
    })
  }
  handleShowTodo(){
    this.setState({...this.state, ["showTodo"]: true});
  }
  async getTodo(){
    const apiKey = sessionStorage.getItem("apiKey")
    if(apiKey){
      this.setState({...this.state, ["isLoading"]: true});
      try {
        const res = await fetch('https://api-todo-ebon.vercel.app/api/v1/todos', {
          method: 'GET',
          headers: {
            "X-Api-Key": apiKey,
          }
        })
        if(res.ok){
          let todoList = await res.json();
          this.setState({["isLoading"]: false, ["showTodo"]: true, ["todoList"]: todoList.data});
        }else{
          this.setState({["isLoading"]: false, ["showTodo"]: false})
        }
      } catch (error) {
        this.setState({...this.state, ["isLoading"]: false})
      }
    }else{
      this.setState({...this.state, ["isLoading"]: false})
    }
  }
  handleClick = async() => {
    const apiKey = sessionStorage.getItem("apiKey");
    this.setState({...this.state, ["isLoading"]: true});
    if(apiKey){
      try {
        let url = 'https://api-todo-ebon.vercel.app/api/v1/todos/'+ this.id;
        const res = await fetch(url , {
          method: 'DELETE',
          headers: {
            "X-Api-Key": apiKey,
          }
        })
        if(res.ok){
          await this.getTodo()
          toast.success(`Đã xóa thành công !!!`);
        }
        else{
          toast.warning(` Chưa xóa được công việc - Hãy thử lại`)
        }
      } catch (error) {
        toast.error(` Có lỗi xảy ra - Kiểm tra lại`)
      }
    }
  }
  render() {
    let {showTodo, isLoading} = this.state;
    return (
      <div>
      {
        !showTodo && !isLoading ? < TypeEmail App = {this}/> : ''
      }
      {
        showTodo ? <TodosApp App = {this}/> : ''
      }
      {
        isLoading ? <Loadding /> : ''
      }
      <ToastContainer autoClose={1000} onClick={(e)=>{
        this.handleClick(e)
      }} pauseOnHover={false}/>
    </div>
    )
  }
}
