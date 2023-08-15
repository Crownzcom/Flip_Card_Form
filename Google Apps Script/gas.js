/**
 * Handles POST requests.
 * @param {Object} e - The event object containing the request data.
 * @returns {Object} - The response object.
 */
function doPost(e) {
    try {
        // Parse the incoming JSON request body to extract data.
        var requestData = JSON.parse(e.postData.contents);
        
        // Get the active Google Sheet.
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        
        // Determine the type of request and handle accordingly.
        if (requestData.type === 'saveDetails') {
            // Access the 'PlayerDetails' sheet.
            var detailsSheet = ss.getSheetByName("PlayerDetails");
            if (!detailsSheet) throw new Error("PlayerDetails sheet not found.");
  
            // Fetch all emails from the 'PlayerDetails' sheet for duplication check.
            var emails = detailsSheet.getRange(1, 2, detailsSheet.getLastRow()).getValues().flat();
  
            // Convert the emails array to a Set for efficient lookup.
            var emailSet = new Set(emails);
  
            // Check if the provided email already exists in the Set.
            if (emailSet.has(requestData.Email)) {
                // If email exists, return a message indicating so.
                return ContentService.createTextOutput(JSON.stringify({ result: 'Success', message: 'Email already exists.' }))
                    .setMimeType(ContentService.MimeType.JSON);
            } else {
                // If email doesn't exist, append the details to the 'PlayerDetails' sheet.
                detailsSheet.appendRow([requestData.Name, requestData.Email]);
                return ContentService.createTextOutput(JSON.stringify({ result: 'Success' }))
                    .setMimeType(ContentService.MimeType.JSON);
            }
        } else {
            // If the request type is neither 'saveTime' nor 'saveDetails', throw an error.
            throw new Error("Invalid request type.");
        }
        
    } catch (error) {
        // Log any errors for debugging purposes.
        Logger.log(error.toString());
        
        // Return an error response.
        return ContentService.createTextOutput(JSON.stringify({ result: 'Error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}