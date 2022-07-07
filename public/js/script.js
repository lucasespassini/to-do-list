var open1 = document.getElementById('open1')
var open2 = document.getElementById('open2')
var open3 = document.getElementById('open3')
var close1 = document.getElementById('close1')
var close2 = document.getElementById('close2')
var close3 = document.getElementById('close3')
var form1 = document.getElementById('form1')
var form2 = document.getElementById('form2')
var form3 = document.getElementById('form3')

open1.addEventListener('click', () => {
   if (form1.style.display == 'block') {
      form1.style.display = 'none'
   } else {
      form1.style.display = 'block'
   }
})
close1.addEventListener('click', () => {
   if (form1.style.display == 'block') {
      form1.style.display = 'none'
   } else {
      form1.style.display = 'block'
   }
})

open2.addEventListener('click', () => {
   if (form2.style.display == 'block') {
      form2.style.display = 'none'
   } else {
      form2.style.display = 'block'
   }
})
close2.addEventListener('click', () => {
   if (form2.style.display == 'block') {
      form2.style.display = 'none'
   } else {
      form2.style.display = 'block'
   }
})

open3.addEventListener('click', () => {
   if (form3.style.display == 'block') {
      form3.style.display = 'none'
   } else {
      form3.style.display = 'block'
   }
})
close3.addEventListener('click', () => {
   if (form3.style.display == 'block') {
      form3.style.display = 'none'
   } else {
      form3.style.display = 'block'
   }
})