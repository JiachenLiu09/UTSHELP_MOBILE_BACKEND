# UTSHELP_MOBILE_FRONTEND
//get all skillset(The type of the workshop)
    url: http://utshelpmobileserver-env.eemrgf7eub.us-east-2.elasticbeanstalk.com:8888/skillSet
    method: get
    return json type:
        [
            {
                "skillSetId": ...,
                "name": ...,
                ...
            },
            {
                "skillSetId": ...,
                "name": ...,
                ...
            },
            ...
        ]

//get workshops typed by sillset
    url: http://utshelpmobileserver-env.eemrgf7eub.us-east-2.elasticbeanstalk.com:8888/skillSet/workshopList
    method: post
    request type:
        {	
	        "skillSetId":...
        }
    return json type:
        [
            {
                "workShopId": ...,
                "name": ...,
                ...
            },
            {
                "workShopId": ...,
                "name": ...,
                ...
            },
            ...
        ]
        
//get the student information
    url: http://utshelpmobileserver-env.eemrgf7eub.us-east-2.elasticbeanstalk.com:8888/studentInformation
    method: get
    return json type:
        [
            {
                "studentId": ...,
                "email": ...,
                ...
            },
            {
                "studentId": ...,
                "email": ...,
                ...
            },
            ...
        ]

//login
    url: http://utshelpmobileserver-env.eemrgf7eub.us-east-2.elasticbeanstalk.com:8888/skillSet/login
    method: post
    request type:
        {	
	        "email":...
            "password"...
        }
    return json type:
        if login success:
        [
            {
                "studentId": ...,
                "email": ...,
                ...
            },
            {
                "studentId": ...,
                "email": ...,
                ...
            },
            ...
        ]

        if login fail:
        []