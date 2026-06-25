

let base_url = `https://jsonplaceholder.typicode.com`
let post_url  =`${base_url}/posts` ;  











const postContainer = document.getElementById('postContainer');

const spinner  =document.getElementById('spinner'); 
const addPost = document.getElementById('addPost');
const updatePost = document.getElementById('updatePost');

const postForm = document.getElementById('postForm');

const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');





function snackbar(msg,icon){  
     swal.fire({  
        title:msg,
        icon:icon, 
        timer:3000
     })
}



function tooltip(){ 
   $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        })    
}


function makeApiCall(method,url,body=null){ 
        
   return new Promise((resolve,reject)=>{ 
         spinner.classList.remove('d-none');
          let xhr  = new XMLHttpRequest(); 
              xhr.open(method,url); 
              xhr.send(body ? JSON.stringify(body) : null) 
             
             xhr.onload = function (){ 
                 if(xhr.status>=200 && xhr.status<=299){ 
                      let res  = JSON.parse(xhr.response);
                      if(method=== "GET"){ 
                          resolve(res);
                            tooltip();
                        }else if(method === "POST"){ 
                          let obj = {...body,id:res.id} 
                            resolve(obj);
                            tooltip();  

                        }else if(method==="PATCH" || method=== "PUT"){ 
                             resolve(res);
                             tooltip();

                        }else{ 
                             resolve();
                             tooltip();
                          }
                  
                          spinner.classList.add('d-none');
                         
                       } else{ 
                           spinner.classList.add('d-none');
                          
                          reject(res);
                       }  
                   } 

            xhr.onerror = function(){ 
                     reject(xhr);
              } 

   })

}


function createCards(arr){ 
         let res = ' '; 

         arr.forEach(ele=>{ 
                res +=`<div class="col-md-4 mt-4 mb-4" id=${ele.id}>
                        <div class="card h-100"> 
                            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${ele.title}">
                                <h5>${ele.title}</h5>
                            </div>
                            <div class="card-body">
                                <h4>Content:-</h4>
                                <p>${ele.body}</p>        
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <i  onclick="onEdit(this)" class="fa-solid  fa-pen-to-square fa-2x text-primary"></i> 
                                <i onclick="onRemove(this)" class="fa-solid   fa-trash fa-2x text-danger"></i>
                                </div>
                            </div>
                        </div>`
         });


         postContainer.innerHTML =  res ;
}



function fetchPost(){ 

    makeApiCall('GET',post_url,null)
       .then((res)=>{ 
            createCards(res);
            postForm.reset();
       })

       .catch((rej)=>{ 
            createCards(rej);
       })
      .finally(()=>{ 
            spinner.classList.add('d-none'); 
      })


}


fetchPost();


function onSubmit(eve){ 
    eve.preventDefault(); 
  
  let newObj = { 
       title:titleControl.value ,
       body:bodyControl.value 

     } 




     //This approach is for when we update form using  and click on update button  using 'Enter' Key 

     
         
          makeApiCall('POST',post_url ,newObj)
                  .then((res)=>{ 
                       createSingleCards(res);
                       snackbar('Added successfully','success');   
                  })
                  .catch((rej)=>{ 
                        reject(rej);
                      snackbar(rej, 'error');
                  }) 
                  .finally(()=>{ 
                        spinner.classList.add('d-none');
                  })

  
   

} 



function createSingleCards(newObj){ 
          let  div  =document.createElement('div'); 
               div.id= newObj.id; 
               div.className = 'col-md-4 mb-4 mt-4';
               div.innerHTML= `<div class="card h-100"> 
                            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newObj.title}">
                                <h5>${newObj.title}</h5>
                            </div>
                            <div class="card-body">
                                <h4>Content:-</h4>
                                <p>${newObj.body}</p>        
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <i  onclick="onEdit(this)"  class="fa-solid fa-pen-to-square fa-2x text-primary"></i> 
                                <i  onclick="onRemove(this)"  class="fa-solid  fa-trash fa-2x text-danger"></i>
                                </div>
                            </div>`           
       
         postContainer.prepend(div);
                      
} 






function onRemove(ele){ 
   let removeId = ele.closest('.col-md-4').id;
   localStorage.setItem('removeId', removeId); 
     let removeUrl =`${post_url}/${removeId}`;

  
     Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) { 
            
            makeApiCall('DELETE',removeUrl ,null) 
                       .then((res)=>{ 
                            removeCard(res);
                            snackbar('deleted successfully...!', 'success');
                       })
                        .catch((rej)=>{ 
                            snackbar(rej,'error');
                        })
            }
        });



}


function removeCard(){
           let remove=localStorage.getItem('removeId');
               document.getElementById(remove).remove();
} 








function onEdit(ele){ 
      let editId= ele.closest('.col-md-4').id; 
      
      let editUrl = `${post_url}/${editId}`;

      makeApiCall('GET',editUrl,null)
       .then(res=>{ 
             editPost(res);
                 window.scrollTo({top:0, behavior:'smooth'});
            })
       .catch((rej)=>{ 
               snackbar(rej,'error'); 
       })
}




function editPost(editObj){ 
         titleControl.value= editObj.title;
         bodyControl.value= editObj.body;
         
         addPost.classList.add('d-none'); 
         updatePost.classList.remove('d-none');
}


function  onUpdate(){ 
     let updateId= localStorage.getItem('editId');
     
    let updateUrl = `${post_url}/${updateId}`;
       let updateObj ={  
            title:titleControl.value ,
            body:bodyControl.value
       }
       makeApiCall('PATCH', updateUrl,updateObj) 
        .then((res)=>{ 
             updateCard(res);
             snackbar('updated successfully.....!', 'success');
                           
              onEdit= false;
        })
        .catch((rej)=>{ 
              snackbar(rej,'error');
        })

}


function  updateCard(updateObj){ 
        let update =localStorage.getItem('editId');
           let div = document.getElementById(update);
           div.innerHTML= `<div class="card h-100"> 
                            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${updateObj.title}">
                                <h5>${updateObj.title}</h5>
                            </div>
                            <div class="card-body">
                                <h4>Content:-</h4>
                                <p>${updateObj.body}</p>        
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <i  onclick="onEdit(this)"  class="fa-solid fa-pen-to-square fa-2x text-primary"></i> 
                                <i  onclick="onRemove(this)"  class="fa-solid  fa-trash fa-2x text-danger"></i>
                                </div>
                            </div>`

          
           postForm.reset();       
          div.scrollIntoView({block:'center',behavior:'smooth'});             
}











postForm.addEventListener('submit', onSubmit); 
updatePost.addEventListener('click', onUpdate);



//

// postForm.addEventListener('keydown', function(e){ 
//                 console.log(e.key);
                           
//                 if(e.key==="Enter"){ 
//                         e.preventDefault() // it will  prevent default behavior  
//                            onUpdate();
//                 }       
// })








