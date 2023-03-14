let options = {};
const clientWidth = Math.max(
	document.body.scrollWidth, document.documentElement.scrollWidth,
	document.body.offsetWidth, document.documentElement.offsetWidth,
	document.body.clientWidth, document.documentElement.clientWidth
)
if (clientWidth < 769) {
	options = {
		isMobile: true,
		autoClose: true,
	}
}

new AirDatepicker('#datepicker', options);



const likeSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#f5f2e8"><path d="m12 21.275-1.6-1.425q-2.55-2.3-4.212-3.963Q4.525 14.225 3.55 12.9q-.975-1.325-1.362-2.45Q1.8 9.325 1.8 8.15q0-2.45 1.625-4.075T7.5 2.45q1.3 0 2.463.525 1.162.525 2.037 1.5.85-.975 2.025-1.5Q15.2 2.45 16.5 2.45q2.425 0 4.062 1.625Q22.2 5.7 22.2 8.15q0 1.175-.388 2.288-.387 1.112-1.362 2.437-.975 1.325-2.65 3-1.675 1.675-4.225 3.975Zm0-3.075q2.375-2.15 3.925-3.663 1.55-1.512 2.438-2.65.887-1.137 1.224-2.012.338-.875.338-1.725 0-1.475-.975-2.45-.975-.975-2.45-.975-1.15 0-2.137.662-.988.663-1.363 1.688h-2q-.375-1.025-1.363-1.688-.987-.662-2.137-.662-1.475 0-2.45.975-.975.975-.975 2.45 0 .875.35 1.75t1.238 2q.887 1.125 2.425 2.65Q9.625 16.075 12 18.2Zm0-6.725Z"/></svg>`;
const likeSvgfilled = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#f07b61"><path d="m12 21.275-1.6-1.425q-2.55-2.3-4.212-3.963Q4.525 14.225 3.55 12.9q-.975-1.325-1.362-2.45Q1.8 9.325 1.8 8.15q0-2.45 1.625-4.075T7.5 2.45q1.3 0 2.463.525 1.162.525 2.037 1.5.85-.975 2.025-1.5Q15.2 2.45 16.5 2.45q2.425 0 4.062 1.625Q22.2 5.7 22.2 8.15q0 1.175-.388 2.288-.387 1.112-1.362 2.437-.975 1.325-2.65 3-1.675 1.675-4.225 3.975Z"/></svg>`;
const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#f5f2e8"><path d="M6.925 21.2q-.925 0-1.6-.662-.675-.663-.675-1.613V6.075H3.525V3.8H8.85V2.65h6.275V3.8h5.35v2.275H19.35v12.85q0 .95-.675 1.613-.675.662-1.6.662Zm10.15-15.125H6.925v12.85h10.15ZM8.9 17h2.125V8H8.9Zm4.075 0H15.1V8h-2.125ZM6.925 6.075v12.85Z"/></svg>`;




const form = document.querySelector('.form');

form.name.addEventListener('input', () => deleteErrorMessage('name'));
form.datepicker.addEventListener('input', () => deleteErrorMessage('datepicker'));
form.datepicker.addEventListener('blur', () => deleteErrorMessage('datepicker'));
form.textarea.addEventListener('input', () => deleteErrorMessage('textarea'));

document.body.addEventListener('keydown', (e) => {
	if (e.code == 'Enter' && e.target.nodeName != 'TEXTAREA' && e.target.nodeName != 'INPUT') handler();
})
form.addEventListener('submit', handler);

function handler(e) {
	e?.preventDefault();

	const li = document.createElement('li');
	li.classList.add('comment');

	let isValidate = true;
	isValidate = validateInput('name') && isValidate;
	isValidate = validateInput('datepicker') && isValidate;
	isValidate = validateInput('text') && isValidate;
	if ( !isValidate ) return;

	const elements = ['name', 'date', 'text', 'like', 'delete'];
	data = {
		form: form,
		datapicker: form.datepicker,
		likeIcon: likeSvg,
		deleteIcon: deleteSvg,
	}
	elements.forEach( (element) => li.append(createElement(element, form, form.datepicker, likeSvg, deleteSvg)) );

	li.children[3].addEventListener('click', toggleLike);
	li.children[4].addEventListener('click', deleteElement);

	document.querySelector('.comments').append(li);

	form.reset();
}


function createElement(elementType, form, datepicker, likeIcon, deleteIcon) {
	const div = document.createElement('div');

	div.classList.add(`comment__${elementType}`);

	switch (elementType) {
		case 'date':
			const time = new Date(),
				  hourse = time.getHours();
				  date = datepicker.value;
			let minutes = time.getMinutes();

			minutes = minutes < 10 ? `0${minutes}` : minutes;
		
			div.textContent = `${getFormatedDate(date)}, ${hourse}:${minutes}`;
			break;

		case 'name':
		case 'text':
			div.textContent = form[elementType].value;
			break;
		
		case 'like':
			div.innerHTML = likeIcon;
			div.dataset.liked = 'false';
			break;
		
		case 'delete':
			div.innerHTML = deleteIcon;
			break;
	}

	return div;
}

function getFormatedDate(date) {
	const nowDate = new Date();
		  day = date.slice(0, 2),
		  month = date.slice(3, 5),
		  year = date.slice(6),
		  divDate = new Date(year, month - 1, day, ...nowDate.toLocaleTimeString('it-IT').slice(0, 8).split(':'));

	if ( date == '' || Math.abs(nowDate - divDate) < 10000 ) return 'Сегодня';

	if ( (nowDate > divDate) && (nowDate - divDate < 1000 * 60 * 60 * 24 + 10000) ) return 'Вчера';
	
	return date;
}

function toggleLike(e) {
	if (e.target.nodeName == 'DIV') return;

	const likeDiv = e.target.closest('div');

	if (likeDiv.dataset.liked === 'true')	{
		likeDiv.innerHTML = likeSvg;
		likeDiv.style.setProperty('--like-color', '#f5f2e8');
		
		likeDiv.dataset.liked = 'false';
		
		return;
	}
	
	likeDiv.innerHTML = likeSvgfilled;
	likeDiv.style.setProperty('--like-color', '#f07b61');

	likeDiv.dataset.liked = 'true';
}

function deleteElement(e) {
	if (e.target.nodeName == 'DIV') return;

	e.target.closest('li').remove();
}

function validateInput(inputId) {
	const input = document.getElementById(inputId);

	switch (inputId) {
		case 'name':
			if (input.value.trim().length < 2 || input.value.trim().length >= 40) {
				addErrorMessage(input, 'Введите корректное имя!')
				return false;
			}
			break;
		case 'datepicker':
			regexp = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

			if (input.value.length > 0 && (!input.value.match(regexp) || input.value.length != 10)) {
				addErrorMessage(input, 'Некорректный формат даты!');
				return false;
			}
			break;
		case 'text':
			if (input.value.trim().length < 3) {
				addErrorMessage(input, 'Слишком короткий комментарий!')
				return false;
			}
			break;
	}

	return true;
}

function addErrorMessage(input, text) {
	const error = document.createElement('div');

	error.classList.add('form__error');
	error.textContent = text;
	error.dataset.for = input.name;

	error.style.top = input.getBoundingClientRect().bottom + window.pageYOffset + 5 + 'px';
	error.style.left = input.getBoundingClientRect().left + window.pageXOffset + 'px';

	form.append(error);
}

function deleteErrorMessage(inputName) {
	const errors = document.querySelectorAll('.form__error');

	errors.forEach((e) => {
		if (e.dataset.for == inputName) e.remove();
	})
}