

async function callOpenAI(){
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
     apiKey: "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"//process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
     model: "text-davinci-003",
     prompt: `Convert the following java spring controller code to python flask view 
     package com.example.jupiter.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.jupiter.entities.Buildingmaster;
import com.example.jupiter.entities.Officemaster;
import com.example.jupiter.exception.EntityAlreadyExistsException;
import com.example.jupiter.exception.EntityDoesNotExistException;
import com.example.jupiter.repository.BuildingmasterRepository;
import com.example.jupiter.repository.OfficemasterRepository;
import com.example.jupiter.service.BuildingmasterService;

@RestController
public class BuildingmasterController {
	
	@Autowired
	public BuildingmasterService buildingservice;
	
	@GetMapping("/building/getAll")
	public List<Buildingmaster> getBuildings() throws EntityDoesNotExistException{
		return buildingservice.getBuildings();
	}
	
	
	@GetMapping("/building/getByOfficeId/{officeid}")
	public List<Buildingmaster> getBuildingByOfficeid(@PathVariable int officeid) throws EntityDoesNotExistException{
		return buildingservice.getBuildingByOfficeid(officeid);
	}
	
	
	@PostMapping("building/create") 
	public ResponseEntity<Object> createBuilding(@RequestBody Buildingmaster buildingmaster) throws EntityAlreadyExistsException{
		try {
			return new ResponseEntity<>(buildingservice.createBuilding(buildingmaster), HttpStatus.CREATED);
		}
		catch(EntityAlreadyExistsException entityAlreadyExistsException) {
			return new ResponseEntity<Object>(entityAlreadyExistsException.getMessage(), HttpStatus.CONFLICT);
		}
		catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@PutMapping("building/update/{buildingid}")
	public ResponseEntity<Object> updateBuilding(@RequestBody Buildingmaster buildingmaster, @PathVariable Integer buildingid) throws EntityDoesNotExistException{
		try {
			return new ResponseEntity<>(buildingservice.updateBuilding(buildingmaster, buildingid), HttpStatus.OK);
		}
		catch (EntityDoesNotExistException entityDoesNotExistException) {
			// TODO: handle exception
			return new ResponseEntity<>(entityDoesNotExistException.getMessage(), HttpStatus.NOT_FOUND);
		}
		catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	
	@DeleteMapping("building/delete/{buildingid}")
	public ResponseEntity<Object> deleteBuilding(@PathVariable Integer buildingid) throws EntityDoesNotExistException{
		try {
			buildingservice.deleteBuilding(buildingid);
			return new ResponseEntity<>(HttpStatus.OK);
		}
		catch(EntityDoesNotExistException entityDoesNotExistException) {
			return new ResponseEntity<>(entityDoesNotExistException.getMessage(), HttpStatus.NO_CONTENT);
		}
		catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
}

     `,
     temperature: 0.7,
     max_tokens: 100,
    });
    console.log(response);    
    console.log("------\\\\\\\\\\\\\\\\\\\\\\\\\\---------------\\\\\\\\\-----");
    console.log(response.data.choices[0].text);
}

callOpenAI();