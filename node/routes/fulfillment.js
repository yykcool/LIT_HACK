const express = require('express');
const router = express.Router();

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const psql = require("./exports/psql.js");

router.post('/', (request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    const agent = new WebhookClient({ request, response });
    
    function show_salary_card(agent, title, text, buttonUrl) {
      agent.add(new Card({
          title: `For ${title} matters,`,
          // imageUrl: 'https://media.licdn.com/dms/image/C4D0BAQEkax4FMwq0BQ/company-logo_200_200/0?e=2159024400&v=beta&t=2sWWqw7qosm0oOZpCTgfCvQWM2_08lgCHMeEEU3tyhU',
          text: text,
          buttonText: `For more Information on ${title}`,
          buttonUrl: buttonUrl
        })
      );
    }
   
    function handle_help(agent) {
      psql.put("asd", "asdasd");
      let queryResult = request.body.queryResult;
      let complaintType = queryResult.parameters.ComplaintType;
      complaintType = [...new Set(complaintType)];
      
      if (complaintType.indexOf('salary') != -1) {
        show_salary_card(
          agent,
          `salary`,
          `Your employer must pay your salary every month, no later than 7 days after than last salary period, and must not be lower than what was declared to MOM.`,
            'https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/employers-guide/salary-guidelines'
        );
      }
      if (complaintType.indexOf('food') != -1) {
        show_salary_card(
          agent,
          `food`,
          `Your employer must provide you with 3 meals a day.
  Your employer cannot force you to eat food that you're are not supposed to or not comfortable with.`,
            'https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/employers-guide/rest-days-and-well-being'
        );
      }
      if (complaintType.indexOf('rest day') != -1) {
        show_salary_card(
          agent,
          `rest days and well-being`,
          `To ensure that you get enough mental and physical rest, your employer should allow you to have a regular rest day.
  You are entitled to a weekly rest day if your Work Permit was issued or renewed after 1 January 2013.`,
            'https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/employers-guide/rest-days-and-well-being'
        );
      }
      if (complaintType.indexOf('doctor') != -1) {
        show_salary_card(
          agent,
          `medical care`,
          `Your employer is responsible for your medical needs`,
            'https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/employers-guide/rest-days-and-well-being'
        );
      }
      if (complaintType.indexOf('abuse') != -1) {
        show_salary_card(
          agent,
          `abuse and ill-treatment`,
          `Employers will face severe penalties if they are convicted of abusing a foreign domestic worker, especially if they concern physical or sexual abuse.
  Complaints of abuse will be investigated by the police.`,
            'https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/employers-guide/abuse-and-ill-treatment'
        );
      }
      agent.add(`Please be sure that a certain violation has been committed before proceeding.`);
      agent.add(`Would you like to report an infringement?`);
      agent.add(new Suggestion(`Yes`));
      agent.add(new Suggestion(`No`));
    }
  
    function handle_help_yes(agent) {
      let outputContexts = request.body.queryResult.outputContexts;
      if (outputContexts.length < 1) {
        return;
      }
  
      let complaintType = outputContexts[0].parameters.ComplaintType;
      complaintType = [...new Set(complaintType)];
  
        agent.add(`Here is what you can do:`);
      if (complaintType.indexOf('salary') != -1 || complaintType.indexOf('food') != -1 || complaintType.indexOf('rest day') != -1) {
          agent.add(`You may wish to contact the Foreign Domestic Worker helpline at 1800 339 5505 (+65 6339 5505 for overseas callers)
  ---
  or Centre for Domestic Employees\n1800 225 5233 (24 hrs)`);
            agent.add(`For more information: https://www.mom.gov.sg/faq/work-permit-for-fdw/what-should-i-do-if-an-fdw-has-not-been-paid-is-overworked-or-not-given-enough-food`);
      }
      agent.add(`You can choose to:
      
  - Report an infringement online: https://services.mom.gov.sg/efeedback/?option=11
  
  - Email to mom_fmmd@mom.gov.sg`);

      
    }
    
    function handle_unfair_contracts(agent) {
      agent.add(`May I confirm that this is a business-consumer transaction?`);
      agent.add(new Suggestion(`Yes`));
      agent.add(new Suggestion(`No`));
    }
    
    function handle_unfair_contracts_yes(agent) {
      agent.add(`What would you like to do?`);
      agent.add(new Suggestion(`Learn about Consumer Protection (Fair Trading) Act (CPTFA)`));
      agent.add(new Suggestion(`Learn about Unfair Contract Terms Act (UCTA)`));
      // agent.add(new Suggestion(`Contact a Civil Litigation Lawyer`));
    }
    
    function handle_unfair_contracts_yes_sct(agent) {
        agent.add(`•	To make a claim at the Small Claims Tribunals (SCT), you can either fax in the form or lodge a claim in person at the SCT. There will be a non-refundable lodgement fee that has to be paid to process your claim.
  •	You will need a civil litigation lawyer to assist with your legal matters. 
  
  Information from:
  https://singaporelegaladvice.com/law-articles/make-small-claim-small-claims-tribunal-singapore/
  
  •	Procedure for small claims tribunal: 
  The Registrar will conduct the initial mediation and consultation. If both sides cannot come to a settlement, the claim will be heard by a referee. The parties will present their side of the story themselves, and cannot be represented by a lawyer. Witnesses may even be called in. Finally, the referee will make a decision to either enforce or reject the claim.
  •	An advantage of the SCT is that the loser does not have to bear any legal costs incurred.
  Information:
  https://singaporelegaladvice.com/law-articles/make-small-claim-small-claims-tribunal-singapore/`);
          agent.add(new Suggestion(`Learn about Small Claims Tribunals`));
          agent.add(new Suggestion(`Learn about legal actions for Consumer Protection`));
          agent.add(new Suggestion(`Contact a Civil Litigation Lawyer`));
          agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_unfair_contracts_yes_cll(agent) {
        agent.add(`You may find a relevant lawyer here:`);
        agent.add(`https://singaporelegaladvice.com/find-a-lawyer/services/litigation-lawyers/`);
        agent.add(new Suggestion(`Learn about Small Claims Tribunals`));
        agent.add(new Suggestion(`Learn about legal actions for Consumer Protection`));
        agent.add(new Suggestion(`Contact a Civil Litigation Lawyer`));
          agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_yes(agent) {
      agent.add(`A faster and more affordable alternative to common law civil claim is the Workplace Compensation Act (WICA) 
  - Domestic workers, uniformed personnel and independent contractors are not covered under WICA`);
      agent.add(`If you wish to pursue a civil suit under common law, you would need a lawyer 
  - https://singaporelegaladvice.com/find-a-lawyer/services/personal-injury-lawyers/`);
      agent.add(`What do you wish to know next?`);
      agent.add(new Suggestion(`Learn more about the types of claims that can be made`));
      agent.add(new Suggestion(`What is the process for compensation`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_claims(agent) {
      agent.add(`What type of claims do you wish to know more about?`);
      agent.add(new Suggestion(`Medical Leave Wages / Expenses`));
      agent.add(new Suggestion(`Lump Sum`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_medical_leave_wages_expenses(agent) {
      agent.add(`It is possible to claim for working days covered by medical leave given by Singapore registered doctors, or hospitalisation leave.
  https://singaporelegaladvice.com/law-articles/how-to-obtain-work-injury-compensation-for-workplace-accidents/`);
      agent.add(`You can also use calculators provided by MOM to find out your average monthly earnings
  https://www.mom.gov.sg/workplace-safety-and-health/work-injury-compensation/resources-and-tools/wic-calculators/average-monthly-earnings`);
      agent.add(`What do you wish to know next?`);
      agent.add(new Suggestion(`Learn more about the types of claims that can be made`));
      agent.add(new Suggestion(`What is the process for compensation`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_lump_sum(agent) {
      agent.add(`Calculator for permanent incapacity compensation 
  https://www.mom.gov.sg/workplace-safety-and-health/work-injury-compensation/resources-and-tools/wic-calculators/permanent-incapacity-compensation`);
      agent.add(`Calculator for compensation for death 
  https://www.mom.gov.sg/workplace-safety-and-health/work-injury-compensation/resources-and-tools/wic-calculators/compensation-for-death`);
      agent.add(`What do you wish to know next?`);
      agent.add(new Suggestion(`Learn more about the types of claims that can be made`));
      agent.add(new Suggestion(`What is the process for compensation`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_compensation(agent) {
      agent.add(`What type of compensation do you wish to know more about?`);
      agent.add(new Suggestion(`Filing Process`));
      agent.add(new Suggestion(`Civil Suit`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_compensation_filing(agent) {
      agent.add(`Report the accident to your employer immediately and seek compensation for medical leave wages and treatment`);
      agent.add(`If you are permanently incapacitated, 
  •	Report the injury to your employer as soon as possible.
  •	Your employer will report the accident to the Ministry of Manpower (MOM), and MOM will send you a claim application form.
  •	After receiving the claim application form, you will have to make a choice whether you wish to make the claim under the WICA. If you do, MOM will process the claim, and if not, MOM will send you an acknowledgment that you do not wish to claim under the WICA.
  •	If you wish to make the claim, you will need to go for a medical assessment to assess the extent of your incapacity.
  •	After this medical assessment, you will receive a notice of the assessment as well as the compensation amount.`);
      agent.add(`You may wish to hire a lawyer to assist you to file a WICA claim on your own 
  https://singaporelegaladvice.com/find-a-lawyer/services/personal-injury-lawyers/`);
      agent.add(`What do you wish to know next?`);
      agent.add(new Suggestion(`Learn more about the types of claims that can be made`));
      agent.add(new Suggestion(`What is the process for compensation`));
      agent.add(new Suggestion(`Goodbye!`));
    }
    
    function handle_personal_injury_compensation_civil(agent) {
      agent.add(`You only can either file a civil suit against your employer to receive compensation for workplace related injury or claim under WICA
  •	Civil suit will have no limits on compensation, but damages have to be proved
  •	A claim under WICA will save you legal fees `);
      agent.add(`If you wish to file a suit, you should hire a lawyer
  https://singaporelegaladvice.com/find-a-lawyer/services/personal-injury-lawyers/ `);
      agent.add(`What do you wish to know next?`);
      agent.add(new Suggestion(`Learn more about the types of claims that can be made`));
      agent.add(new Suggestion(`What is the process for compensation`));
      agent.add(new Suggestion(`Goodbye!`));
    }
  
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Need Help with Employer', handle_help);
    intentMap.set('Need Help with Employer - yes', handle_help_yes);
    intentMap.set('Unfair Contracts (General Inquiry)', handle_unfair_contracts);
    intentMap.set('Unfair Contracts (General Inquiry) - yes', handle_unfair_contracts_yes);
    intentMap.set('Unfair Contracts (General Inquiry) - SCT', handle_unfair_contracts_yes_sct);
    intentMap.set('Unfair Contracts (General Inquiry) - CLL', handle_unfair_contracts_yes_cll);
    intentMap.set('Personal Injury - yes', handle_personal_injury_yes);
    intentMap.set('Personal Injury - Claims', handle_personal_injury_claims);
    intentMap.set('Personal Injury - Medical Leave Wages Expenses', handle_personal_injury_medical_leave_wages_expenses);
    intentMap.set('Personal Injury - Lump Sum', handle_personal_injury_lump_sum);
    intentMap.set('Personal Injury - Compensation', handle_personal_injury_compensation);
    intentMap.set('Personal Injury - Compensation Filing', handle_personal_injury_compensation_filing);
    intentMap.set('Personal Injury - Compensation Civil', handle_personal_injury_compensation_civil);
    agent.handleRequest(intentMap);
  
  });

module.exports = router;