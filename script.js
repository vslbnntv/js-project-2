
 const TODOS = 'TODOS';

 class Application {
     
     _todoList;
 
     _alertBlock;
 
     _addBtn;
 
    
     _sortBtn;
 
     _sortDirection = false;
 
     
     _todoService;
 
     constructor(todoService) {
         this._todoService = todoService;
         this._todoList = this._getElement('#todo-list');
         this._alertBlock = this._getElement('#alert-block');
         this._addBtn = this._getElement('#add-btn');
         this._sortBtn = this._getElement('#sort-btn');
 
         this._addBtn.addEventListener('click', e => this._handleAdd());
         this._sortBtn.addEventListener('click', e => this._handleSort());
         this._displayTodos();
     }
 
     
     get todos() { return this._todoService.getTodos(); }
 
     
     _displayTodos() {
         const todos = this.todos;
 
         this._todoList.innerHTML = todos?.length ? '' : '';
 
         todos.forEach(t => {
             const listItem = document.createElement('li');
             listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', );
             const input = document.createElement('input');
             input.value = t.title;

             input.addEventListener('change', e => this._handleEdit(t.id, e.target.value));
 
             listItem.append(input);

 
             const deleteBtn = document.createElement('button');
             deleteBtn.classList.add('deleteHover');
             deleteBtn.innerHTML = `
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C4C4C4"/>
             <path d="M6 6L14 14" stroke="#C4C4C4"/>
             <path d="M6 14L14 6" stroke="#C4C4C4"/>
             </svg>
                 <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
               </svg>
             `;
             deleteBtn.addEventListener('click', e => this._handleDelete(t.id));
 
             listItem.append(deleteBtn);
 
             this._todoList.append(listItem);
         });
     }

     _handleAdd() {
         try {
             this._todoService.addTodo();
             this._displayTodos();
         } catch (error) {
             this._showError(error.message);
         }
     }

     _handleEdit(id, title) {
         try {
             this._todoService.editTodo(id, title);
             this._displayTodos();
         } catch (error) {
             this._showError(error.message);
         }
     }

     _handleDelete(id) {
         this._todoService.deleteTodo(id);
         this._displayTodos();
     }

     _handleSort() {
         this._todoService.sortTodos(this._sortDirection);
         this._sortDirection = !this._sortDirection;
         this._sortBtn.innerHTML = (!this._sortDirection ?
             `
             <svg width="25" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.5" width="2.5" height="12.5" fill="#C4C4C4"/>
<rect x="10" y="3.75" width="2.5" height="7.5" transform="rotate(-90 10 3.75)" fill="#C4C4C4"/>
<rect x="10" y="8.75" width="2.5" height="10" transform="rotate(-90 10 8.75)" fill="#C4C4C4"/>
<rect x="10" y="13.75" width="2.5" height="15" transform="rotate(-90 10 13.75)" fill="#C4C4C4"/>
<path d="M3.75 15L0.502405 10.3125L6.9976 10.3125L3.75 15Z" fill="#C4C4C4"/>
</svg>

         `: `
         <svg width="25" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect x="5" y="15" width="2.5" height="12.5" transform="rotate(-180 5 15)" fill="#C4C4C4"/>
         <rect x="10" y="3.75" width="2.5" height="7.5" transform="rotate(-90 10 3.75)" fill="#C4C4C4"/>
         <rect x="10" y="8.75" width="2.5" height="10" transform="rotate(-90 10 8.75)" fill="#C4C4C4"/>
         <rect x="10" y="13.75" width="2.5" height="15" transform="rotate(-90 10 13.75)" fill="#C4C4C4"/>
         <path d="M3.75 6.55671e-07L6.99759 4.6875L0.502404 4.6875L3.75 6.55671e-07Z" fill="#C4C4C4"/>
         </svg>
         `) ;
         this._displayTodos();
     }
     _showError(message) {
         // console.log(message);
         const wrapper = document.createElement('div');
         wrapper.innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
 
         this._alertBlock.append(wrapper);
 
         if (this._alertBlock.childElementCount > 3) {
             this._alertBlock.firstChild.remove();
         }
 
         setTimeout(() => {
             wrapper.remove();
         }, 5000, this);
 
         this._displayTodos();
     }

     _getElement(selector) {
         const element = document.querySelector(selector);
 
         if (element) return element;
         throw new Error(`There are no such element for ${selector} selector.`);
     }
 }

 class TodoService {
 
     _todos;

     constructor(todos = []) {
         this._todos = todos;
         this._init();
     }

     _init() {
       
         const todos = JSON.parse(localStorage.getItem(TODOS) || '[]');
 
         this._todos = [...this._todos, ...todos];
     }
 
     _commit() {
         localStorage.setItem(TODOS, JSON.stringify(this._todos));
     }
 
    
     getTodos() {
         return [...this._todos];
     }
 
    
     addTodo(title = '') {
         if (!this._todos.some(t => !t.title)) {
             const todo = { id: this._generateId(), title };
             this._todos = [todo, ...this._todos];
             this._commit();
             return todo;
         }
         throw new Error('Zəhmət olmasa xananı doldur');
     }
 
     
     deleteTodo(id) {
         this._todos = this._todos.filter(t => t.id !== id);
         this._commit();
         return this._todos.length;
     }
 
 
     editTodo(id, title) {
         if (title) {
             const todos = [...this._todos];
             todos[this._getIndex(id)].title = title;
             this._todos = todos;
             this._commit();
         } else {
             throw new Error('You can not change title to empty, for delete element, click delete button.');
         }
     }
 
     
     sortTodos(direction) {
         let todos = [...this._todos].filter(t => t.title).sort((t1, t2) => t1.title.toUpperCase() > t2.title.toUpperCase() ? 1 : -1);
 
         if (!direction) {
             
             todos.reverse();
         }
 
         this._todos = todos;
 
         this._commit();
     }
 
    
     _generateId() {
         return this._todos?.length ? (this._todos[0].id + 1) : 1;
     }
 
     _getIndex(id) {
         const index = this._todos.findIndex(t => t.id === id);
 
         if (index !== -1) {
             return index;
         }
 
         throw new Error(`There are no such todo with ${id} id.`)
     }
 }
 
 const app = new Application(new TodoService());