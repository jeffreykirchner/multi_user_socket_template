

      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";

      var app = Vue.createApp({
      
          delimiters: ["[[", "]]"],

          data() { return {
              loginButtonText : 'Submit <i class="fas fa-sign-in-alt"></i>',
              loginErrorText : "",
              form_ids : {{form_ids|safe}},
              }                          
          },

          methods:{
              //get current, last or next month

              login:function(){
                  app.$data.loginButtonText = '<i class="fas fa-spinner fa-spin"></i>';
                  app.$data.loginErrorText = "";

                  axios.post('/accounts/login/', {
                          action :"login",
                          formData : $("#login_form").serializeArray(), 
                                                      
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
                          app.$data.loginErrorText = "Username or Password is incorrect."
                        }
                        else
                        {
                          window.location = response.data.redirect_path;
                        }

                        app.$data.loginButtonText = 'Submit <i class="fas fa-sign-in-alt"></i>';

                      })
                      .catch(function (error) {
                          console.log(error);                            
                      });                        
                  },

                  clearMainFormErrors:function(){

                        s = app.$data.form_ids;                    
                        for(var i in s)
                        {
                            $("#id_" + s[i]).attr("class","form-control");
                            $("#id_errors_" + s[i]).remove();
                        }

                    },
              
                //display form errors
                displayErrors:function(errors){
                      for(var e in errors)
                      {
                          $("#id_" + e).attr("class","form-control is-invalid")
                          var str='<span id=id_errors_'+ e +' class="text-danger">';
                          
                          for(var i in errors[e])
                          {
                              str +=errors[e][i] + '<br>';
                          }

                          str+='</span>';
                          $("#div_id_" + e).append(str); 

                      }
                  },

              
          },            

          mounted() {
                                      
          },
      }).mount('#app');