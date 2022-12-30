package main

import (
	"infratesting/cmd"
)

func main() {
	
	firstName := user.fName
	lastName := user.lName
	
	err := cmd.Execute()
	if err != nil {
		panic(err)
	}

}
