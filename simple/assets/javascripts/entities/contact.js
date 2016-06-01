ContactManager.module("Entities", function(Entities, ContactManager,
	Backbone, Marionette, $, _){

		Entities.Contact = Backbone.Model.extend({
			urlRoot: "contacts",
			validate: function(attrs, options) {
				var errors = {}
				if (! attrs.firstName) {
					errors.firstName = "обязательное поле";
				}
				if (! attrs.lastName) {
					errors.lastName = "обязательное поле";
				}
				else{
					if (attrs.lastName.length < 2) {
					errors.lastName = "слишком короткая";
					}
				}
				if( ! _.isEmpty(errors)){
					return errors;
				}
			},
			defaults: {
				firstName: "",
				lastName: "",
				phoneNumber: ""
			}
		});


		Entities.configureStorage(Entities.Contact);

		Entities.ContactCollection = Backbone.Collection.extend({
			url: "contacts",
			model: Entities.Contact,
			comparator: "firstName"
		});

		Entities.configureStorage(Entities.ContactCollection);

		//var contacts;

		var initializeContacts = function(){
		var contacts = new Entities.ContactCollection([
			{ id: 1, firstName: "Кларк", lastName: "Кент",
			phoneNumber: "123-0001" },
			{ id: 2, firstName: "Брюс", lastName: "Уэйн",
			phoneNumber: "123-0002" },
			{ id: 3, firstName: "Питер", lastName: "Паркер",
			phoneNumber: "123-0003" }
			]);

			contacts.forEach(function(contact){
				contact.save();
			});

			return contacts.models;
		};

		var API = {
			getContactEntities: function(){			
			var contacts = new Entities.ContactCollection();
			var defer = $.Deferred();
			contacts.fetch({
				success: function(data){
					defer.resolve(data);
				}
			});

			var promise = defer.promise();
			$.when(promise).done(function(contacts){
				if(contacts.length === 0){
					var models = initializeContacts();
					contacts.reset(models);
				}
			});

			return promise;

			},
			getContactEntity: function(contactId){
				var contact = new Entities.Contact({id: contactId});
				var defer = $.Deferred();
				setTimeout( function(){
					contact.fetch({
						success: function(data){
							defer.resolve(data);
						},
						error: function(data){
							defer.resolve(undefined);
						}
					});
				}, 0 );
				
				return defer.promise();
				//return contact;
			}
		};

	ContactManager.reqres.setHandler("contact:entities", function(){
		return API.getContactEntities();
	});
	ContactManager.reqres.setHandler("contact:entity", function(id){
		return API.getContactEntity(id);
	});
});