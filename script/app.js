(function ($) {
    var contacts = [
        { 
            name: "Contact 1", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "family" 
        },
        { 
            name: "Contact 2", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "family" 
        },
        { 
            name: "Contact 3", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "friend" 
        },
        { 
            name: "Contact 4", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "colleague" 
        },
        { 
            name: "Contact 5", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "family" 
        },
        { 
            name: "Contact 6", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "colleague" 
        },
        { 
            name: "Contact 7", 
            address: "1, a street, a town, a city, AB12 3CD",
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "friend" 
        },
        { 
            name: "Contact 8", 
            address: "1, a street, a town, a city, AB12 3CD", 
            tel: "0123456789", 
            email: "anemail@me.com", 
            type: "family" 
        }
        ];

    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "img/placeholder.png"
        }
    });

    var Directory = Backbone.Collection.extend({
        model: Contact
    });

    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),
        render: function(){
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
    });

    var DirectoryView = Backbone.View.extend({
        el: $("#contacts"),
        initialize: function(){
            this.collection = new Directory(contacts);
            this.render();
            this.$el.find("#filter").append(this.createSelect());
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.render, this);
        },
        render: function(){
            var that = this;
            this.$el.find("article").remove();
            _.each(this.collection.models, function(item){
                that.renderContact(item);   
            }, this);
        },
        renderContact: function(item){
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },
        getTypes: function(){
            return _.uniq(this.collection.pluck("type"), false, function(type){
                return type.toLowerCase();
            });
        },
        createSelect: function(){
            var select = $("<select/>", {
                html: "<option>All</option>"
            });

            _.each(this.getTypes(), function(item){
                var option = $("<option/>", {
                    value: item.toLowerCase(),
                    text: item.toLowerCase()
                }).appendTo(select);
            });

            return select;
        },

        events: {
            "change #filter select": "setFilter"
        },

        setFilter: function(event){
            this.filterType = event.currentTarget.value;
            this.trigger("change:filterType");
        },

        filterByType: function(){
            console.info(this.filterType);
            if (this.filterType.toLowerCase() === "all") {
                this.collection.reset(contacts);
                contactsRouter.navigate("filter/all");
            } else {
                this.collection.reset(contacts, {silent: true});
                var filterType = this.filterType;
                var filtered = _.filter(this.collection.models, function(item){
                    return item.get("type").toLowerCase() === filterType;
                });
                console.dir(filtered);
                this.collection.reset(filtered);
                contactsRouter.navigate("filter/"+filterType);
            }
        }
    });

    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type": "urlFilter"
        },
        urlFilter: function(type){
            directory.filterType = type;
            directory.trigger("change:filterType");
        }
    });

    var directory = new DirectoryView();
    var contactsRouter = new ContactsRouter();

    Backbone.history.start();
} (jQuery));
