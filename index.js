let tasks = [];
let currentId = 1;
let filterState = 'all';

// 當網頁載入完成後，從 localStorage 讀取資料並更新 UI
document.addEventListener('DOMContentLoaded', function(){
  tasks = loadTasks();
  if (tasks.length > 0) {
    // 讓 currentId 為現有最大 id + 1
    currentId = Math.max(...tasks.map(task => task.id)) + 1;
  }
  updateUI();
});

// 新增待辦事項
function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();
  
  if (taskText === "") {
    alert("請輸入內容！");
    return;
  }

  const newTask = {
    id: currentId++,
    task: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasks(tasks);
  updateUI();
  taskInput.value = "";
}

// 儲存待辦事項清單到 localStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 從 localStorage 讀取待辦事項清單
function loadTasks() {
  const tasksStr = localStorage.getItem('tasks');
  return tasksStr ? JSON.parse(tasksStr) : [];
}

// 根據 filterState 過濾待辦事項
function filterTasks(tasks) {
  if (filterState === 'all') return tasks;
  if (filterState === 'completed') return tasks.filter(task => task.completed);
  if (filterState === 'incomplete') return tasks.filter(task => !task.completed);
}

// 設定過濾狀態並更新 UI
function setFilter(state) {
  filterState = state;
  updateUI();
}

// 更新 UI：根據 tasks 陣列重繪清單
function updateUI() {
  const filteredTasks = filterTasks(tasks);
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = '';
  filteredTasks.forEach(taskObj => {
    let li = document.createElement("li");
    li.textContent = taskObj.task;
    
    if (taskObj.completed) {
      li.classList.add("completed");
    }
    
    // 點擊 li 標記完成（避免編輯與刪除按鈕點擊影響）
    li.addEventListener("click", function(e) {
      // 避免點擊按鈕時觸發
      if (e.target.tagName !== "BUTTON") {
        taskObj.completed = !taskObj.completed;
        saveTasks(tasks);
        updateUI();
      }
    });
    
    // 編輯按鈕
    let editBtn = document.createElement("button");
    editBtn.textContent = "編輯";
    editBtn.style.backgroundColor = "#ffc107";
    editBtn.style.color = "white";
    editBtn.style.marginLeft = "10px";
    editBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      editTask(li, taskObj);
    });
    li.appendChild(editBtn);
    
    // 刪除按鈕
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "刪除";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.backgroundColor = "#dc3545";
    deleteBtn.style.color = "white";
    deleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      tasks = tasks.filter(task => task.id !== taskObj.id);
      saveTasks(tasks);
      updateUI();
    });
    li.appendChild(deleteBtn);
    
    taskList.appendChild(li);
  });
}

// 編輯待辦事項：替換 li 內容為編輯介面
function editTask(li, taskObj) {
  li.innerHTML = '';
  let input = document.createElement('input');
  input.type = 'text';
  input.value = taskObj.task;
  li.appendChild(input);
  
  let confirmBtn = document.createElement('button');
  confirmBtn.textContent = '確認';
  confirmBtn.style.backgroundColor = "#28a745";
  confirmBtn.style.color = "white";
  confirmBtn.style.marginLeft = "10px";
  li.appendChild(confirmBtn);
  
  let cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.style.backgroundColor = "#6c757d";
  cancelBtn.style.color = "white";
  cancelBtn.style.marginLeft = "10px";
  li.appendChild(cancelBtn);
  
  confirmBtn.addEventListener('click', function() {
    const newText = input.value.trim();
    if (newText === "") {
      alert("內容不可為空！");
      return;
    }
    taskObj.task = newText;
    saveTasks(tasks);
    updateUI();
  });
  
  cancelBtn.addEventListener('click', function() {
    updateUI();
  });
}


