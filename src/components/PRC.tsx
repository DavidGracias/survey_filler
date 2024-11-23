import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ComponentProps from '../types/ComponentProps';

enum Stages {
  GeneralDemographics,
}

export default function PRC({ url, body, tabId, information }: ComponentProps) {
  // const documentDomParser = useMemo(() => new DOMParser().parseFromString(body, "text/html"), [body])
  // const [stage, setStage] = useState<Stages>(Stages.GeneralDemographics)

  // useEffect(() => {
  //   const title = documentDomParser.querySelector(".page-title")?.textContent;
  //   if (title == "General Demographics") setStage(Stages.GeneralDemographics);

  // }, [body])

  // useEffect(() => {
  //   switch (stage) {
  //     case Stages.GeneralDemographics:
  //       chrome.scripting.executeScript({
  //         target: { tabId: tabId },
  //         func: (information) => {
  //           // Loop through all label and input pairs
  //           document.querySelectorAll("label").forEach((label) => {
  //             const labelText = label.textContent!.trim(); // Get the label text
  //             // Find the input associated with the label
  //             const inputId = label.getAttribute("for")!;
  //             const input = document.getElementById(inputId) as HTMLInputElement;

  //             switch (labelText) {
  //               case "First Name":
  //               case "First Name *":
  //                 input.value = information.firstName;
  //                 break;
  //               case "Last Name":
  //               case "Last Name *":
  //                 input.value = information.lastName;
  //                 break;
  //               case "City/Town":
  //               case "City/Town *":
  //                 input.value = information.city;
  //                 break;
  //               case "State/Province":
  //               case "State/Province *":
  //                 input.value = information.state;
  //                 break;
  //               case "ZIP/Postal Code":
  //               case "ZIP/Postal Code *":
  //                 input.value = information.zipcode;
  //                 break;
  //               case "State/Province":
  //               case "State/Province *":
  //                 input.value = `${information.stateAbbreviation} ${information.state}`;
  //                 break;
  //               case "County":
  //               case "County *":
  //                 input.value = information.county;
  //                 break;
  //               case "Email Address":
  //               case "Email Address *":
  //                 input.value = information.email;
  //                 break;
  //               case "Phone Number":
  //               case "Primary phone number":
  //               case "Primary phone number *":
  //                 input.value = information.phone;
  //                 break;
  //               case "Street address":
  //               case "Street address *":
  //                 input.value = information.streetAddress;
  //                 break;
  //             }
  //           });

  //           // // Handle select dropdowns
  //           // document.querySelectorAll("select").forEach((select) => {
  //           //   const label = document.querySelector(`label[for='${select.id}']`);
  //           //   if (label) {
  //           //     const labelText = label.textContent.trim();
  //           //     const fieldKey = fieldMapping[labelText];

  //           //     if (fieldKey && information[fieldKey] !== undefined) {
  //           //       select.value = information[fieldKey]; // Set the dropdown value
  //           //     }
  //           //   }
  //           // });

  //         },
  //         args: [information],
  //       });

  //       break;
  //   }

  // }, [stage]);


  return (
    <Container sx={{ minWidth: "300px", padding: "10px" }}>
      Unknown survey {url} will need to be implemented still
    </Container>
  );
}