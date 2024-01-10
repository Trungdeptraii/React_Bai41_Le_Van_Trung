import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import style from '../assets/css/todoItem.module.css'
import "bootstrap/dist/css/bootstrap.min.css"

export default class TodoItem extends Component {
    constructor({App}){
        super()
        this.state = {
            todo: '',
        }
        this.App = App;
        this.todoUpdate = {
        }
    }
    handleDelete(el){
        toast.warning(`Click để xác nhận xóa "${el.todo}"`, {data: {type: 'delete', id: el._id}, autoClose: 3000})
    }
    handleTodo = (e)=>{
        this.todoUpdate = {...this.todoUpdate, [e.target.name]: e.target.value};
    }
    checkComplete =(e) =>{
        let titleTodo = e.target.parentNode.children[0].children[0];
        if(e.target.checked){
            this.inputValue.style.textDecoration = 'line-through';
            this.todoUpdate = {...this.todoUpdate, isCompleted: e.target.checked};
            titleTodo.innerText = 'Completed';
        }else if(!e.target.checked){
            this.inputValue.style.textDecoration = 'none';
            this.todoUpdate = {...this.todoUpdate, isCompleted: e.target.checked};
            titleTodo.innerText = 'Not Completed';
        }
    }
    handldeExit = (e) =>{
        const element = e.target;
        const parentEl = element.parentNode;
        const inputEl = parentEl.parentNode.parentNode.previousElementSibling.children[0];
        inputEl.disabled = true;
        inputEl.style.border = '2px solid grey';
        let preEl = parentEl.parentNode.previousElementSibling;
        preEl.style.display = 'flex';
        parentEl.parentNode.style.display = 'none';
        this.App.getTodo();
    }
    handldeEdit = (e) =>{
        let parentEl = e.target.parentNode;
        let input = parentEl.parentNode.previousElementSibling.children[0];
        input.disabled = false;
        input.style.border = '2px solid blue';
        this.inputValue = input;
        this.todoUpdate = {...this.todoUpdate, todo: input.value}
        let nextParentEl = parentEl.nextElementSibling;
        nextParentEl.style.display = 'flex';
        parentEl.style.display = 'none';
    }
    handldeUpdate =(id) =>{
        this.updateTodo(this.todoUpdate, id)
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
                body: JSON.stringify(data)
                })
                if(res.ok){
                    toast.success(`Đã cập nhật thành công !!!`);
                    await this.App.getTodo();
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
    render() {
        let todoList = this.props.App.state.todoList.listTodo;
        return (
            Array.isArray(todoList) && todoList.length ? todoList.map((el)=>{
                return (
                    <div className={style["item"]} key={uuidv4()}>
                        <div className={style["edit-todo"]}>
                            <input disabled type="text" name='todo' onChange={this.handleTodo} defaultValue={el.todo} style={{textDecoration : el.isCompleted ? 'line-through' : ''}}/>
                        </div>
                        <div className={style["option"]}>
                            <div className={style["option-item"]}>
                                <button className=" btn btn-primary" onClick={this.handldeEdit}>Sửa</button>
                                <button className="btn btn-danger" onClick={()=>{this.handleDelete(el)}}>Xóa</button>
                            </div>
                            <div className={style["option-items"]}>
                                <div className={style["option-check"]}>
                                    <label htmlFor="complete">
                                        <span className={style["status-todo"]}>{el.isCompleted ? 'Completed' : "Not Completed"}</span>
                                    </label>
                                    <input type="checkbox" id='complete' onChange={this.checkComplete} name='complete' defaultChecked={el.isCompleted ? true: false}/>
                                </div>
                                <div className={style["option-handle"]}>
                                    <button className=" btn btn-warning" onClick={this.handldeExit}>Thoát</button>
                                    <button className="btn btn-success" onClick={()=>{this.handldeUpdate(el._id)}}>Update</button>
                                    <button className="btn btn-danger" onClick={()=>{this.handleDelete(el)}}>Xóa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }) : <h2>Chưa có todo</h2>
        )
    }
}


