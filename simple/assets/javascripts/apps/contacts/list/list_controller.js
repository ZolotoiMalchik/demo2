ContactManager.module("ContactsApp.List", function(List, ContactManager,
Backbone, Marionette, $, _){
	List.Controller = {
		listContacts: function(c){
		var loadingView = new ContactManager.Common.Views.Loading();
			ContactManager.regions.main.show( loadingView );
			
		var fetchingContacts = ContactManager.request("contact:entities");
		console.log("After entities");
		var contactsListLayout = new List.Layout();
		var contactsListPanel = new List.Panel();

		$.when( fetchingContacts ).done(function(contacts){
			var contactsListView = new List.Contacts({
				collection: contacts

			});

			contactsListLayout.on("show", function(){			
				contactsListLayout.contactsRegion.show(contactsListView);
				contactsListLayout.panelRegion.show(contactsListPanel);
			});

			contactsListPanel.on("contact:new", function(){
				var newContact = new ContactManager.Entities.Contact();

				var view = new ContactManager.ContactsApp.New.Contact({
					model: newContact,
					asModal: true
				});

				view.on("form:submit", function(data){
					var highestId = contacts.max(function(c){ return c.id; });
					highestId = highestId.get("id");
					data.id = highestId + 1;
					if(newContact.save(data)){
						contacts.add(newContact);
						$('div span.ui-icon-closethick').trigger('click');
						contactsListView.children.findByModel(newContact).flash("success");
					}
					else{
						view.triggerMethod("form:data:invalid",
						newContact.validationError);
					}
					
				});

				ContactManager.regions.dialogRegion.show(view);
			});

			contactsListView.on("childview:contact:delete", function(childView, model){				
				model.destroy();
			});
			contactsListView.on("childview:contact:edit", function(childView, model){				
				var view = new ContactManager.ContactsApp.Edit.Contact({
						model: model,
						asModal: true
					});

					view.on("form:submit", function(data){
						if(model.save(data)){
							childView.render();							
							$('div span.ui-icon-closethick').trigger('click');
							childView.flash("success");
						}
						else{
							view.triggerMethod("form:data:invalid", model.validationError);
						}
					});

					ContactManager.regions.dialogRegion.show(view);
			});
			contactsListView.on("childview:contact:show", function(childView, model){				
				ContactManager.trigger("contact:show", model.get("id"));
			});			
			
			ContactManager.regions.main.show(contactsListLayout);
		});

		}
	}
});
