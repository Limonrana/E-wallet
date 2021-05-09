/*
 * ProjectName: eWallet Project
 * Description: eWallet Project all functions and event.
 * Author: Limon Rana
 * Date: 18 Jan 2021
 */


/***************************************************************
 * Tropic: Form Submit EventListener Start
 * Description: Form submit eventListener and callback function.
 ***************************************************************/
document.querySelector('#ewallet-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.querySelector('.add__type').value;
        const desc = document.querySelector('.add__description').value;
        const value = document.querySelector('.add__value').value;

        formValidation(type, desc, value);
    })


/******************************************************************
 * Tropic: Show Item Function Start
 * Description: All item show to dom from local storage with function.
 ******************************************************************/
//Call this function
showAllItems();

function showAllItems() {
    let items = getItemToLocalStorage();
    const collection = document.querySelector('.collection');

    for (const item of items) {
        const itemHtml = `
            <div class="item">
            <div class="item-description-time">
                <div class="item-description">
                <p>${item.desc}</p>
                </div>
                <div class="item-time">
                <p>${item.date}</p>
                </div>
            </div>
            <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
                <p>${item.type}$${sep(item.value)}</p>
            </div>
            </div>
        `;
        collection.insertAdjacentHTML('afterbegin', itemHtml);
    }
}


/*******************************************************
 * Tropic: AddItem Function Start
 * Description: Colloection Item Add with this function.
 *******************************************************/
function addItem(type, desc, value) {
    const collection = document.querySelector('.collection');
    let date = formatedDate();
    const itemHtml = `
        <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>${desc}</p>
            </div>
            <div class="item-time">
              <p>${date}</p>
            </div>
          </div>
          <div class="item-amount ${type === '+' ? 'income-amount' : 'expense-amount'}">
            <p>${type}$${sep(value)}</p>
          </div>
        </div>
    `;
    collection.insertAdjacentHTML('afterbegin', itemHtml);
    addItemToLocalStorage(desc, date, type, value);
    showIncome();
    showExpense();
    totalBalance();
}


/*************************************************************
 * Tropic: Form Validtion Function Start
 * Description: Form field check and alert with this function.
 *************************************************************/

function formValidation(type, desc, value) {
    const getDesc = document.querySelector('.add__description');
    const getValue = document.querySelector('.add__value');

    if (desc === '') {
        getDesc.style.border = '1px solid red';
        getDesc.placeholder = 'Description is required❗️';
        getDesc.classList.add('placeholder__color');
    } else if (value === '') {
        getValue.style.border = '1px solid red';
        getValue.placeholder = 'required❗️';
        getValue.classList.add('placeholder__color');
    } else {
        addItem(type, desc, value);
        resetForm();
    }
}


/*******************************************************
 * Tropic: Calculate Function Start
 * Description: Calculate All Income & Expenses Item.
 *******************************************************/
//Income Function
showIncome();

function showIncome() {
    let items = getItemToLocalStorage();
    // let totalIncome = 0;
    // for (const item of items) {
    //     item.type === '+' ? totalIncome += parseInt(item.value) : '';
    // }
    let totalIncome = items.filter((item) => item.type === '+')
        .reduce((income, item) => income + parseInt(item.value), 0);
    document
        .querySelector('.income__amount p')
        .innerText = `$${sep(totalIncome)}`;
}

//Expense Function
showExpense();

function showExpense() {
    let items = getItemToLocalStorage();
    // let totalExpense = 0;
    // for (const item of items) {
    //     item.type === '-' ? totalExpense += parseInt(item.value) : '';
    // }
    let totalExpense = items.filter((item) => item.type === '-')
        .reduce((expense, item) => expense + parseInt(item.value), 0);
    document
        .querySelector('.expense__amount p')
        .innerText = `$${sep(totalExpense)}`;
}

//Total Balance Function
totalBalance();

function totalBalance() {
    let items = getItemToLocalStorage();
    let balance = 0;
    for (const item of items) {
        item.type === '+' ? balance += parseInt(item.value) : balance -= parseInt(item.value);
    }
    document
        .querySelector('.balance__amount p')
        .innerText = `$${sep(balance)}`;
    document
        .querySelector('header')
        .className = (balance >= 0) ? 'green' : 'red';
}


/******************************************************************
 * Tropic: Store Item Function Start
 * Description: All item store to local storage with this function.
 ******************************************************************/
function getItemToLocalStorage() {
    let items = localStorage.getItem('items');
    return items ? JSON.parse(items) : [];
}



/******************************************************************
 * Tropic: Store Item Function Start
 * Description: All item store to local storage with this function.
 ******************************************************************/
function addItemToLocalStorage(desc, date, type, value) {
    let items = getItemToLocalStorage();
    items.push({
        desc,
        date,
        type,
        value
    });
    localStorage.setItem('items', JSON.stringify(items));
}


/***********************************************************
 * Tropic: Reset Form Function Start
 * Description: After form submit this form all value reset.
 ***********************************************************/
function resetForm() {
    document.querySelector('.add__type').value = '+';
    document.querySelector('.add__description').value = '';
    document.querySelector('.add__value').value = '';
}


/***********************************************************
 * Tropic: Date Function Start
 * Description: Javascript default date formated with our need.
 ***********************************************************/
function formatedDate() {
    const now = new Date()
        .toLocaleTimeString('en-us', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const date = now.split(',')[0].split(' ');
    const time = now.split(',')[1];
    return `${date[1]} ${date[0]},${time}`;
}

/***********************************************************
 * Tropic: Separator Function
 * Description: Amount Separate with this function.
 ***********************************************************/

function sep(amount) {
    amount = parseInt(amount);
    return amount.toLocaleString();
}