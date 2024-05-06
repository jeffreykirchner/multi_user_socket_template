

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

var app = Vue.createApp({

    delimiters: ["[[", "]]"],

    data() { return {
        login_button_text : 'Submit <i class="fas fa-sign-in-alt"></i>',
        login_error_text : "",
        form_ids : {{form_ids|safe}},
        username : null,
        password : null,
        }                          
    },

    methods:{
    //get current, last or next month

        login:function login(){
            app.login_button_text = '<i class="fas fa-spinner fa-spin"></i>';
            app.login_error_text = "";
            let form = document.querySelector('login_form');

            axios.post('/accounts/login/', {
                    action :"login",
                    form_data : {username:app.username, password:app.password},                              
                })
                .then(function (response) {     
                    
                status=response.data.status;                               

                app.clear_main_form_errors();

                if(status == "validation")
                {              
                    //form validation error           
                    app.display_errors(response.data.errors);
                }
                else if(status == "error")
                {
                    app.login_error_text = "Username or Password is incorrect."
                }
                else
                {
                    window.location = response.data.redirect_path;
                }

                app.login_button_text = 'Submit <i class="fas fa-sign-in-alt"></i>';

                })
                .catch(function (error) {
                    console.log(error);                            
                });                        
        },

        clear_main_form_errors: function clear_main_form_errors(){

            s = app.form_ids;                    
            for(let i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }

        },
            
        //display form errors
        display_errors: function display_errors(errors){
            for(let e in errors)
            {
                let str='<span id=id_errors_'+ e +' class="text-danger">';
                
                for(let i in errors[e])
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