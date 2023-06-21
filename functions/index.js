const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');


admin.initializeApp();

exports.getSchoolDataFern = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('schools').get();

    // Extract the data from the snapshot
    const schools = [];
    snapshot.forEach((doc) => {
      schools.push(doc.data());
    });

    // Send the response with the school data
    res.status(200).json(schools);
    return schools
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send('Error retrieving school data');
  }
});

exports.getAllSchoolsFern = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return {
      status: 'error',
      code: 401,
      message: 'Not signed in'
    };
  }

  try {
    const snapshot = await admin.firestore().collection('schools').get();
    const schools = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return schools;
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Error retrieving school data');
  }
});