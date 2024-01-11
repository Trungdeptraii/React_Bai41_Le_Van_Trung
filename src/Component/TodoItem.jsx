import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import style from '../assets/css/todoItem.module.css'
import "bootstrap/dist/css/bootstrap.min.css"

export default class TodoItem extends Component {
    constructor({App}){
        super()
        this.state = {
            todoEdit: []
        }
        this.App = App;
    }
    handleDelete(el){
        toast.warning(`Click để xác nhận xóa "${el.todo}"`, {data: {type: 'delete', id: el._id}, autoClose: 3000})
    }
    handleTodo = (e, el)=>{
        let {todoEdit} = this.state;
        let result = todoEdit.map((item)=>{
            if(item._id == el._id){
                return {...item, ["todo"]: e.target.value}
            }else return item
        })
        this.setState({todoEdit: result});
    }
    checkComplete =(e, el) =>{
        let {todoEdit} = this.state;
        let result = todoEdit.map((item)=>{
            if(item._id == el._id){
                return {...item, ["isCompleted"]: e.target.checked}
            }else return item
        })
        this.setState({todoEdit: result});
    }
    handldeExit = (el) =>{
        let {todoEdit} = this.state
        let arr = todoEdit.filter(item => item._id != el._id)
        this.setState({todoEdit: arr})
    }
    handldeEdit = (e, el) =>{
        let {todoEdit} = this.state;
        if(!todoEdit.length){
            this.setState({todoEdit: todoEdit.concat(el)})
        }else if(todoEdit.length > 0){
            if(!todoEdit.some(item=>item._id == el._id)){
                this.setState({todoEdit: todoEdit.concat(el)})
            }
        }
    }
    handldeUpdate =(el) =>{
        let {todoEdit} = this.state;
        let todo = todoEdit.find(item=>item._id == el._id);
        this.updateTodo(todo, el._id)
    }
    handleCheckEdit = (el, type='check')=>{
        let {todoEdit} = this.state;
        let todo = todoEdit.find(item=>item._id == el._id)
        if(todo && type =='check'){
            return todo.isCompleted
        }
        if(todo && type == 'value'){
            return todo.todo
        }
    }
    updateTodo = async (data, id)=>{
        const apiKey = sessionStorage.getItem("apiKey");
        if(apiKey){
            try {
                let url = 'https://api-todo-ebon.vercel.app/api/v1/todos/'+id;
                const res = await fetch(url , {
                method: 'PATCH',
                headers: {
                    "X-Api-Key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({todo: data.todo, isCompleted: data.isCompleted})
                })
                console.log('res', await res.json());
                if(res.ok){
                    await this.App.getTodo();
                    toast.success(`Đã cập nhật thành công !!!`);
                    let arr = this.state.todoEdit.filter(item => item._id != id)
                    this.setState({todoEdit: arr})
                }
                else{
                    toast.warning(` Chưa chỉnh sửa được công việc - Hãy thử lại`)
                }
            } catch (error) {
                console.log('error', error);
                toast.error(` Có lỗi xảy ra - Kiểm tra lại`)
            }
            }else{
                toast.warning('Kiểm tra lại todo')
            }
    }
    render(){
        let todoList = this.props.App.state.todoList.listTodo;
        let {todoEdit} = this.state;
        let arrId = todoEdit.map(el=> el._id);
        console.log(todoEdit);
        return (
            Array.isArray(todoList) && todoList.length ? todoList.map((el)=>{
                return (
                    <div className={style["item"]} key={uuidv4()}>
                        <div className={style["edit-todo"]}>
                            <input disabled = {arrId.includes(el._id) ? false : true}  type="text" name='todo' onMouseLeave={(e)=>{this.handleTodo(e, el)}} defaultValue={arrId.includes(el._id) ? this.handleCheckEdit(el, 'value'): el.todo} style={{textDecoration : arrId.includes(el._id) && this.handleCheckEdit(el, 'check') || el.isCompleted && !arrId.includes(el._id) ? 'line-through' : '', border : arrId.includes(el._id) ? '2px solid  blue' : '2px solid  grey'}}/>
                        </div>
                        <div className={style["option"]}>
                            <div className={style["option-item"]} style={{display: !arrId.includes(el._id)? 'flex' : 'none'}}>
                                <button className=" btn btn-primary" onClick={(e)=>{this.handldeEdit(e, el)}}>Sửa</button>
                                <button className="btn btn-danger" onClick={()=>{this.handleDelete(el)}}>Xóa</button>
                            </div>
                            <div className={style["option-items"]} style={{display: arrId.includes(el._id)? 'flex' : 'none'}}>
                                <div className={style["option-check"]}>
                                    <label htmlFor="complete">
                                        <span className={style["status-todo"]}>{arrId.includes(el._id) && this.handleCheckEdit(el, 'check') || el.isCompleted && !arrId.includes(el._id) ? "Completed": "No completed"}</span>
                                        <input type="checkbox" id='complete' onChange={(e)=>{this.checkComplete(e, el)}} name='complete' defaultChecked={arrId.includes(el._id) ? this.handleCheckEdit(el, 'check') : el.isCompleted} />
                                    </label>
                                </div>
                                <div className={style["option-handle"]}>
                                    <button className=" btn btn-warning" onClick={()=>{this.handldeExit(el)}}>Thoát</button>
                                    <button className="btn btn-success" onClick={()=>{this.handldeUpdate(el)}}>Update</button>
                                    <button className="btn btn-danger" onClick={()=>{this.handleDelete(el)}}>Xóa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }) : <h2 style={{color: 'white'}}>Chưa có todo</h2>
        )
    }
}


