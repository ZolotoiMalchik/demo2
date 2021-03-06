ContactManager.module("ContactsApp.Show", function(Show, ContactManager,
Backbone, Marionette, $, _){
	Show.Controller = {
		showContact: function(id){
			var loadingView = new ContactManager.Common.Views.Loading({
				title: "Искусственная задержка",
				message: "Идет загрузка данных..."
			});
			ContactManager.regions.main.show( loadingView );

			var fetchingContact = ContactManager.request("contact:entity", id);
			$.when(fetchingContact).done(function(contact){ 
				var contactView;

				if ( contact !== undefined ) {
	 				contactView = new Show.Contact({
						model: contact
					});

	 				contactView.on("contact:edit", function(contact){
						ContactManager.trigger("contact:edit", contact.get("id"));
					});
					contactView.on("contacts:list", function(){
						ContactManager.trigger("contacts:list");
					});

				} else {
					contactView = new Show.MissingContact();
				}
				
				ContactManager.regions.main.show( contactView );
			});
		}
	}
});
