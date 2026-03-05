let input = document.getElementById('inpt');
let search_queries='';

let vacanciesUrlBase=`https://api.hh.ru/vacancies`//Базовый урл для поиска вакансий

const api2ipUrl='https://api.2ip.io/?token=vs9053tz3i5ssebn&lang=ru'//получение названия города по ip для ru региона
const hhareasUrl='https://api.hh.ru/suggests/areas?text='//получение id города
let finalUrl;
async function getResponse()
{
//Получаем название города по ip с помощью api2ip
let api2ipResponse= await fetch(api2ipUrl)  
let api2ipJson=await api2ipResponse.json()
const cityName= api2ipJson.city//Название на русском
document.getElementById('p1').textContent=cityName;
console.log(cityName);
//достаем id города из массива объектов городов
let hhareasResponse= await fetch(hhareasUrl+cityName)
let hhareasJson=await hhareasResponse.json()

//автопоиск id города в цикле по его названию     
let cityId
for(let i=0;i<hhareasJson.items.length;i++)
        {
          if(hhareasJson.items[i].text==cityName)
          {cityId=hhareasJson.items[i].id
            break;}
        }

console.log(cityId);

//Определяется базовый url, значение из input и id города записываются в параметры url 
let baseUrl = vacanciesUrlBase;
let params = new URLSearchParams({
    text: search_queries, area: cityId
});

// Формирует запрос вакансий с полем text и полем area(id города)
//let finalUrl = `${baseUrl}?${params.toString()}`;
finalUrl = `${baseUrl}?${params.toString()}`;
console.log(finalUrl);

//Получаем список вакансий с hh.ru по введенным данным для города, откуда произошел запрос
let vacanciesResponse= await fetch(finalUrl)
let context=await vacanciesResponse.json()
//Создаем массив из вакансий с выбранными свойствами
const vacset=[];
for(let i=0;i<context.items.length;i++)
  {
    //Создаем и заполняем элемент массива под вакансию
    let vacancy=
    {        
      id:context.items[i].id,
      name: context.items[i].name,
      salary: context.items[i].salary?.from+' — '+context.items[i].salary?.to,
      employer:context.items[i].employer?.name,
      address:context.items[i].address?.raw,
      published:context.items[i].published_at
    }
    vacset.push(vacancy); //Добавляем заполненный элемент в массив

    console.log(vacset[i].id);//Выводим в консоль id вакансии

  }
return vacset//Возвращаем массив из вакансий для вывода на странице
}

async function main() {
  const result = await getResponse(); // Ожидание завершения и получение значения
        for(let i=0;i<result.length;i++)
        {
            let item=document.createElement('div')
            item.classList.add('item')
            item.innerHTML=`
            ${result[i].name}<br>
            ${result[i].salary}<br>
            ${result[i].employer}<br>
            ${result[i].address}<br>
            Опубликованно: ${result[i].published}<br>    
            `
            //Обработка нажатия на карточку с вакансией
            item.addEventListener('click',function()
            {
             window.open(`https://hh.ru/vacancy/${result[i].id}`);//Открытие новой вкладки с выбранной вакансией
            })
            item.addEventListener('click',() => {
            item.style.backgroundColor =  `rgb(${195}, ${123}, ${189})`;//`rgb(${r}${g}${b})`
            })
            document.querySelector('.items').append(item)
          }
}
main();

//Обработка нажатия кнопки
var button=document.getElementById('bs');
button.addEventListener('click',function()
{
  search_queries=input.value.toString();
  alert(search_queries);
  //Очищает div items в котором выводятся вакансии
  document.getElementById('itemsId').replaceChildren();
   main();
}
)