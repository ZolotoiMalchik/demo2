ContactManager.module("ContactsApp", function(ContactsApp, ContactManager,
Backbone, Marionette, $, _){
	ContactsApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"contacts": "listContacts",
			"contacts/:id": "showContact",
			"contacts/:id/edit": "editContact"
		}
	});

	var API = {
		listContacts: function(c){
			ContactsApp.List.Controller.listContacts(c);
		},
		editContact: function(id){
			console.log('EDIT id', id);
			ContactsApp.Edit.Controller.editContact(id);
		},
		showContact: function(id){
			ContactsApp.Show.Controller.showContact(id);	
		}
	};

	ContactManager.on("contacts:list", function(c){
		ContactManager.navigate("contacts");
		API.listContacts(c);
	});

	ContactManager.on("contact:edit", function(id){
		ContactManager.navigate("contacts/" + id + "/edit");
		API.editContact(id);
	});

	ContactManager.on("contact:show", function(id){
		ContactManager.navigate("contacts/" + id);
		API.showContact(id);
	});

	ContactManager.addInitializer(function(){
		new ContactsApp.Router({
			controller: API
		});
	});
});