

      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";

      var app = Vue.createApp({
      
          delimiters: ["[[", "]]"],

          data() { return {
              loginButtonText : 'Submit <i class="fas fa-sign-in-alt"></i>',
              loginErrorText : "",
              form_ids : {{form_ids|safe}},
              username:null,
              password:null,
              }                          
          },

          methods:{
              //get current, last or next month

              login:function(){
                  app.loginButtonText = '<i class="fas fa-spinner fa-spin"></i>';
                  app.loginErrorText = "";
                  var form = document.querySelector('login_form');

                  axios.post('/accounts/login/', {
                          action :"login",
                          formData : {username:app.username, password:app.password},
                                                      
                      })
                      .then(function (response) {     
                          
                        status=response.data.status;                               

                        app.clearMainFormErrors();

                        if(status == "validation")
                        {              
                          //form validation error           
                          app.displayErrors(response.data.errors);
                        }
                        else if(status == "error")
                        {
                          app.loginErrorText = "Username or Password is incorrect."
                        }
                        else
                        {
                          window.location = response.data.redirect_path;
                        }

                        app.loginButtonText = 'Submit <i class="fas fa-sign-in-alt"></i>';

                      })
                      .catch(function (error) {
                          console.log(error);                            
                      });                        
                  },

                  clearMainFormErrors(){

                        s = app.form_ids;                    
                        for(var i in s)
                        {
                            //e = document.getElementById("id_" + s[i]);
                            e = document.getElementById("id_errors_" + s[i]);
                            if(e) e.remove();
                        }

                    },
              
                //display form errors
                displayErrors(errors){
                      for(var e in errors)
                      {
                          //e = document.getElementById("id_" + e).getAttribute("class", "form-control is-invalid")
                          var str='<span id=id_errors_'+ e +' class="text-danger">';
                          
                          for(var i in errors[e])
                          {
                              str +=errors[e][i] + '<br>';
                          }

                          str+='</span>';

                          document.getElementById("div_id_" + e).insertAdjacentHTML('beforeend', str);
                      }
                  },

              
          },            

          mounted() {
                                      
          },
      }).mount('#app');