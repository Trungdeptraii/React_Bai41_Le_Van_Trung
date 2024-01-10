// import React, { useState } from 'react'
import React, { Component } from 'react'
import {toast } from 'react-toastify';

import style from '../assets/css/typeEmail.module.css'
import Loadding from './Loadding';
const url = 'https://api-todo-ebon.vercel.app/api/v1'

// export default  function  TypeEmail({handleEmail}) {
//     let [email, setEmail] = useState('');
//     let [isLoadding, setIsLoadding] = useState(false);
//     const handleSubmit =async (e) =>{
//         e.preventDefault();
//         setIsLoadding(true)
//         try {
//           const res = await fetch(url +'/api-key?email='+email);
//           if(res.ok){
//               const {data} = await res.json()
//               const {apiKey} = data;
//               let name = email.slice(0, email.indexOf('@'))
//               sessionStorage.setItem("apiKey", apiKey);
//               sessionStorage.setItem("name", name);
//               toast.success(`Xin chào ${name}`)
//               setIsLoadding(false)
//               handleEmail(true)
//           }else{
//             toast.warn('Email của bạn không tồn tại!!!')
//             setIsLoadding(false)
//           }
//         } catch (error) {
//           console.log('fail')
//           setIsLoadding(false)
//         }
//     }
//     const handleOnchange = (e)=>{
//         setEmail(e.target.value)
//     }
//   return (
//     <div className={`${style["email-container"]}`}>
//       <form action="" className={style["form"]} onSubmit={handleSubmit}>
//         <input type="email"  placeholder='Nhập email của bạn...' onChange={handleOnchange}/>
//         <button >Gửi</button>
//       </form>
//       {
//         isLoadding ? <Loadding /> : ''
//       }
//     </div>
//   )
// }


export default class TypeEmail extends Component {
  constructor({App}){
    super();
    this.state = {
      email: 'chundeptraii@gmail.com',
      isLoading: false
    }
    this.App = App
  }
  handleSubmit = async (e) =>{
    e.preventDefault();
    this.setState({...this.state, ["isLoading"]: true})
    let email = this.state["email"];
    try {
      const res = await fetch(url +'/api-key?email='+email);
      if(res.ok){
          const {data} = await res.json()
          const {apiKey} = data;
          let name = email.slice(0, email.indexOf('@'))
          sessionStorage.setItem("apiKey", apiKey);
          sessionStorage.setItem("name", name);
          toast.success(`Xin chào ${name}`)
          this.setState({...this.state, ["isLoading"]: false});
          this.App.handleShowTodo();
          this.App.getTodo();
      }else{
        toast.warn('Email của bạn không tồn tại!!!')
        this.setState({...this.state, ["isLoading"]: false})
      }
    } catch (error) {
      toast.error('Không nhận được tín hiệu trả về !!!')
      this.setState({...this.state, ["isLoading"]: false})
    }
  }
  handleOnchange = (e)=>{
    this.setState({...this.state, ["email"]: e.target.value});
  }
  render() {
    let {isLoading} = this.state;
    return (
      <div className={`${style["email-container"]}`}>
        <form action="" className={style["form"]} onSubmit={this.handleSubmit}>
          <input type="email"  placeholder='Nhập email của bạn...' onChange={this.handleOnchange}/>
          <button >Gửi</button>
        </form>
        {
          isLoading ? <Loadding /> : ''
        }
    </div>
    )
  }
}

