/**
 * Hello Greeting Web Script
 *
 * Logic:
 * - If 'username' parameter is provided, fetch the full name from Alfresco
 * - If no 'username' is provided, use the currently logged-in user
 * - Returns the greeting message to the template
 */

// Get the optional username parameter
var usernameParam = args["username"];
var fullName;

// If username is provided, fetch the person's full name from Alfresco
if (usernameParam) {
  var person = people.getPerson(usernameParam);
  if (person) {
    var firstName = person.properties.firstName || "";
    var lastName = person.properties.lastName || "";
    var email = person.properties.email || "";
    fullName = (firstName + " " + lastName).trim() || usernameParam;
    if (email) {
      fullName += " (" + email + ")";
    }
  } else {
    // Username not found, fallback to the parameter itself
    fullName = usernameParam;
  }
} else {
  // No parameter, use the currently logged-in user
  var firstName = person.properties.firstName || "";
  var lastName = person.properties.lastName || "";
  var email = person.properties.email || "";
  fullName = (firstName + " " + lastName).trim() || user.name;
  if (email) {
    fullName += " (" + email + ")";
  }
}

// Construct greeting message
model.greeting = "Welcome, " + fullName + "!";
