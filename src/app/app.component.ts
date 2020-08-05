import { Component } from '@angular/core';
import { title } from 'process';

const todos = [
  {
    id: 1,
    title: '大家好',
    done: true,
  },
  {
    id: 2,
    title: '才是',
    done: true,
  },
  {
    id: 3,
    title: '真的好！',
    done: false,
  },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public todos: {
    id: number;
    title: string;
    done: boolean;
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]');

  public currentEditing: {
    id: number;
    title: string;
    done: boolean;
  } = null;

  public visibility = 'all';
  // 该函数是一个特殊的Angular生命周期的钩子函数
  // 他会在Angular应用初始化的时候执行一次

  ngOnInit() {
    this.hashchangeHandler();
    window.onhashchange = this.hashchangeHandler.bind(this); // bind用法：绑定当前this而不是window的全局this
  }
  // 该方法监视到了数据的改变
  // 持久化存储数据
  ngDoCheck() {
    window.localStorage.setItem('todos',JSON.stringify(this.todos));
  }

  addTodo(e): void {
    const titleText = e.target.value;
    if (!titleText.length) {
      return;
    }
    const last = this.todos[this.todos.length - 1];
    this.todos.push({
      id: last ? last.id + 1 : 1,
      title: titleText,
      done: false,
    });
    e.target.value = '';
    console.log(this.todos);
  }
  get toggleAll() {
    return this.todos.every((t) => t.done);
  }
  set toggleAll(val) {
    this.todos.forEach((t) => (t.done = val));
  }
  removeTodos(index: number) {
    this.todos.splice(index, 1);
  }
  saveTodo(todo, e) {
    // 保存编辑
    todo.title = e.target.value;
    // 取消编辑样式
    this.currentEditing = null;
  }
  handleEditKeyUp(e) {
    const { keyCode, target } = e;
    if (keyCode === 27) {
      // 取消编辑
      // 同时恢复原来文本框的值
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }
  remainingCount() {
    return this.todos.filter((t) => !t.done).length;
  }
  clearAllNoUse() {
    this.todos = this.todos.filter((t) => !t.done);
  }
  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos;
    } else if (this.visibility === 'active') {
      return this.todos.filter((t) => !t.done);
    } else if (this.visibility === 'completed') {
      return this.todos.filter((t) => t.done);
    }
  }
  hashchangeHandler() {
    // 当用户点击了瞄点的时候，我们需要获取当前的瞄点标识
    // 然后动态的将根组件中的visibility设置为当前点击的瞄点标识
    const hash = window.location.hash.substr(1);
    switch (hash) {
      case '/':
        this.visibility = 'all';
        break;
      case '/active':
        this.visibility = 'active';
        break;
      case '/completed':
        this.visibility = 'completed';
        break;
    }
  }
  remaining() {
    return this.todos.filter(t => !t.done).length;
  }
}
