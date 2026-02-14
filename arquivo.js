

const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  icon.classList.remove("fa-moon");
  icon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});


const taskTitle = document.getElementById("taskTitle");
const btnAddTask = document.getElementById("btnAddTask");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "") {
  taskList.innerHTML = "";

  const filtered = tasks.filter(t =>
    (t.title + " " + t.desc).toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("task-card");
    if (task.done) card.classList.add("done");

    card.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.desc}</p>
      </div>

      <div class="task-actions">
        <label class="task-check">
          <input type="checkbox" ${task.done ? "checked" : ""}/>
          <span>Feito</span>
        </label>

        <button class="btn-delete" title="Remover">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    const checkbox = card.querySelector("input[type='checkbox']");
    const deleteBtn = card.querySelector(".btn-delete");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks(searchInput.value);
    });

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks(searchInput.value);
    });

    taskList.appendChild(card);
  });
}

btnAddTask.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  if (title === "") return;

  tasks.unshift({
    id: Date.now(),
    title: title,
    desc: "bla bnla bkla",
    done: false
  });

  taskTitle.value = "";
  saveTasks();
  renderTasks(searchInput.value);
});

taskTitle.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btnAddTask.click();
  }
});

searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});

renderTasks();


const reminderDay = document.getElementById("reminderDay");
const reminderText = document.getElementById("reminderText");
const btnAddReminder = document.getElementById("btnAddReminder");
const reminderList = document.getElementById("reminderList");

let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function renderReminders() {
  reminderList.innerHTML = "";

  if (reminders.length === 0) {
    reminderList.innerHTML = `<p style="color: var(--muted); font-size: 14px;">Nenhum lembrete ainda.</p>`;
    return;
  }

  reminders.forEach(reminder => {
    const item = document.createElement("div");
    item.classList.add("reminder-item");

    item.innerHTML = `
      <div>
        <strong>dia ${reminder.day}</strong><br>
        <span>${reminder.text}</span>
      </div>

      <button title="Excluir">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      reminders = reminders.filter(r => r.id !== reminder.id);
      saveReminders();
      renderReminders();
    });

    reminderList.appendChild(item);
  });
}

btnAddReminder.addEventListener("click", () => {
  const day = reminderDay.value.trim();
  const text = reminderText.value.trim();

  if (day === "" || text === "") return;

  reminders.unshift({
    id: Date.now(),
    day: Number(day),
    text: text
  });

  reminderDay.value = "";
  reminderText.value = "";

  saveReminders();
  renderReminders();
});

renderReminders();



const monthTitle = document.getElementById("monthTitle");
const calendarDays = document.getElementById("calendarDays");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // espaços vazios antes do dia 1
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day", "empty");
    calendarDays.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= lastDate; day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");
    dayBox.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayBox.classList.add("today");
    }

    calendarDays.appendChild(dayBox);
  }
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
