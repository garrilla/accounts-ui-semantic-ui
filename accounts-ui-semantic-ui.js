/**
* @summary Accounts UI
* @namespace
* @memberOf Accounts
*/
Accounts.ui = {};

Accounts.ui._options = {
	requestPermissions: {},
	requestOfflineToken: {},
	forceApprovalPrompt: {},
	extraSignupFields: []
};

// XXX refactor duplicated code in this function

/**
* @summary Configure the behavior of [`{{> loginButtons}}`](#accountsui).
* @locus Client
* @param {Object} options
* @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
* @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
* @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
* @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', or '`EMAIL_ONLY`' (default).
*/
Accounts.ui.config = function(options) {
	// validate options keys
	var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt', 'dropdownClasses', 'dropdownTransition', 'extraSignupFields'];
	_.each(_.keys(options), function (key) {
		if (!_.contains(VALID_KEYS, key))
			throw new Error("Accounts.ui.config: Invalid key: " + key);
	});

	// deal with `dropdownClasses`
	if (options.dropdownClasses) {
		Accounts.ui._options.dropdownClasses = options.dropdownClasses;
	}

	if (options.dropdownTransition) {
		Accounts.ui._options.dropdownTransition = options.dropdownTransition;
	}

	// deal with extra signup fields
	// swiped from ian:accounts-ui-bootstrap-3... you rock!
	options.extraSignupFields = options.extraSignupFields || [];
	if (typeof options.extraSignupFields !== 'object' || !options.extraSignupFields instanceof Array) {
		throw new Error("Accounts.ui.config: `extraSignupFields` must be an array.");
	} else {
		if (options.extraSignupFields) {
			_.each(options.extraSignupFields, function(field, index) {
				if (!field.fieldName || !field.fieldLabel){
					throw new Error("Accounts.ui.config: `extraSignupFields` objects must have `fieldName` and `fieldLabel` attributes.");
				}
				if (typeof field.visible === 'undefined'){
					field.visible = true;
				}
				Accounts.ui._options.extraSignupFields[index] = field;
			});
		}
	}

	// deal with `passwordSignupFields`
	if (options.passwordSignupFields) {
		if (_.contains([
			"USERNAME_AND_EMAIL",
			"USERNAME_AND_OPTIONAL_EMAIL",
			"USERNAME_ONLY",
			"EMAIL_ONLY"
		], options.passwordSignupFields)) {
			if (Accounts.ui._options.passwordSignupFields)
				throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");
			else
				Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
		} else {
			throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
		}
	}

	// deal with `requestPermissions`
	if (options.requestPermissions) {
		_.each(options.requestPermissions, function (scope, service) {
			if (Accounts.ui._options.requestPermissions[service]) {
				throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
			} else if (!(scope instanceof Array)) {
				throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
			} else {
				Accounts.ui._options.requestPermissions[service] = scope;
			}
		});
	}

	// deal with `requestOfflineToken`
	if (options.requestOfflineToken) {
		_.each(options.requestOfflineToken, function (value, service) {
			if (service !== 'google')
				throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");

			if (Accounts.ui._options.requestOfflineToken[service]) {
				throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
			} else {
				Accounts.ui._options.requestOfflineToken[service] = value;
			}
		});
	}

	// deal with `forceApprovalPrompt`
	if (options.forceApprovalPrompt) {
		_.each(options.forceApprovalPrompt, function (value, service) {
			if (service !== 'google')
				throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");

			if (Accounts.ui._options.forceApprovalPrompt[service]) {
				throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
			} else {
				Accounts.ui._options.forceApprovalPrompt[service] = value;
			}
		});
	}
};

passwordSignupFields = function () {
	return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";
};

