const express = require('express');
const router = express.Router();

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');



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

    const {Client} = require('pg');
    const client = new Client();

    client.connect()

   
    function handle_help(agent) {
 
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

      const text = 'INSERT INTO handle_help(complaint_type) VALUES($1) RETURNING *';
      const values = [complaintType];

      client.query(text,values,(err,res) => {
          if(err){
              console.log(err.stack);
          } else {
              console.log(res.rows[0])
          }
      });
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
        const text = 'INSERT INTO handle_unfair_contracts(complaint_type) VALUES($1) RETURNING *';
        const values = ['GENERAL'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
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

            const text = 'INSERT INTO handle_unfair_contracts(complaint_type) VALUES($1) RETURNING *';
            const values = ['SCT'];
      
            client.query(text,values,(err,res) => {
                if(err){
                    console.log(err.stack);
                } else {
                    console.log(res.rows[0])
                }
            });
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

        
        const text = 'INSERT INTO handle_personal_injury(complaint_type) VALUES($1) RETURNING *';
        const values = ['WICA'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
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
      
      function handle_criminal_law(agent) {
        agent.add(`Criminal procedure usually proceeds in this manner:
    •	Reporting of a crime 
    •	Police investigation 
    •	Arrest 
    •	Prosecutorial deliberation and pre-trial decision making 
    •	Bail 
    •	Trial 
    •	Conviction and sentencing 
    •	Appeal
    
    You may seek a defence lawyer once police investigations commenced`);
        agent.add(`Which stage of the legal process are you interested to know more about?`);
        agent.add(new Suggestion(`Arrest and Investigation`));

        const text = 'INSERT INTO handle_criminal_law(complaint_type) VALUES($1) RETURNING *';
        const values = ['GENERAL'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
      }
      
      function handle_criminal_law_arrest_investigation(agent, subprompt=false) {
        if (subprompt) {
            agent.add(`What other questions are you concerned with?`);
        } else {
            agent.add(`What questions are you concerned with?`);
        }
        agent.add(new Suggestion(`What is an arrestable offence`));
        agent.add(new Suggestion(`What are my rights during arrest`));
        agent.add(new Suggestion(`What kinds of statements will the police ask for`));
        agent.add(new Suggestion(`Goodbye!`));

        const text = 'INSERT INTO handle_criminal_law(complaint_type) VALUES($1) RETURNING *';
        const values = ['INVESTIGATION'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
      }
      
      function handle_criminal_law_arrestable(agent) {
        agent.add(`An arrestable case mandates the police to investigate the case as soon as possible, it also confers the powers to arrest without a warrant, as well as special investigative powers. 
    •	Arrestable offences include: offences under the Penal Code, and other Codes 
    •	Persons arrested in this situation may be held up to 
        o	Arrest without warrant: 48 hours
        o	Arrest with warrant: Accused brought to court without unnecessary delay. Article 9(3) of the Constitution also entitles the accused to know the basis of his arrest. It also allows him to consult and be defended by a legal practitioner of his choice 
    A non-arrestable case gives the police discretion on whether or not to investigate. 
    •	Do not that basic” voluntarily causing hurt offence is a non-arrestable offence. Persons alleged to have voluntarily caused hurt to others cannot be arrested if the police do not have a warrant for their arrest`);
        agent.add(`More information can be derived from https://singaporelegaladvice.com/law-articles/arrestable-or-not-seizable-and-non-seizable-offences-in-singapore/`);
        handle_criminal_law_arrest_investigation(agent, true);

        const text = 'INSERT INTO handle_criminal_law(complaint_type) VALUES($1) RETURNING *';
        const values = ['ARRESTABLE'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });

      }
      
      function handle_criminal_law_arrest_rights(agent) {
        agent.add(`1.	Prepare for your interview (speak to your lawyer) 
    2.	Be aware of right against self-incrimination
        a.	Note that it is an offence to lie. 
        b.	Refusal to answer questions asked/silence may result in a negative inference against you. 
    3.	Gather information of your whereabouts during the time of the incident. For e.g. 
        a.	CCTV footage
        b.	Visit the scene of the alleged crime at the earliest opportunity and take photographs of the scene from a number of different angles.
        c.	Witnesses
    4.	Do not communicate with alleged victim.`);
        agent.add(`More information: https://singaporelegaladvice.com/law-articles/police-investigation-singapore/`);
        handle_criminal_law_arrest_investigation(agent, true);

        const text = 'INSERT INTO handle_criminal_law(complaint_type) VALUES($1) RETURNING *';
        const values = ['ARREST_RIGHTS'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
        
      }
      
      function handle_criminal_law_arrest_statements(agent) {
        agent.add(`•	Witness statement: police may orally examine any person whom he believes to have knowledge of the facts and circumstances of the case under investigation.
    •	Caution statement: usually taken before accused is formally charged in court 
        o	the investigating officer has to officially set out the charge the accused is facing and explain it to him.
        o	The accused will then be asked if he wishes to say anything regarding the charge.
        o	Anything said from then on in answer to the charge, or any silence or refusal to make a statement, must be recorded by the investigating officer.`);
        agent.add(`More information: https://singaporelegaladvice.com/law-articles/police-investigation-singapore/`);
        handle_criminal_law_arrest_investigation(agent, true);

        const text = 'INSERT INTO handle_criminal_law(complaint_type) VALUES($1) RETURNING *';
        const values = ['ARREST_STATEMENTS'];
  
        client.query(text,values,(err,res) => {
            if(err){
                console.log(err.stack);
            } else {
                console.log(res.rows[0])
            }
        });
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
      intentMap.set('Criminal Law', handle_criminal_law);
      intentMap.set('Criminal Law - Arrest and Investigation', handle_criminal_law_arrest_investigation);
      intentMap.set('Criminal Law - Arrestable', handle_criminal_law_arrestable);
      intentMap.set('Criminal Law - Arrest Rights', handle_criminal_law_arrest_rights);
      intentMap.set('Criminal Law - Arrest Statements', handle_criminal_law_arrest_statements);
      agent.handleRequest(intentMap);
    });

module.exports = router;