<?php
	error_reporting(E_ALL);

	$dhisApiUrl = 'http://103.69.126.98/ewars/api/';
	
	if(!isset($_GET['type']) && isset($_GET['sDate']) && isset($_GET['eDate']) && isset($_GET['disease'])){
		$sDate = $_GET['sDate'];
		$eDate = $_GET['eDate'];
		$disease = $_GET['disease'];
		
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?';
		$url .= 'dimension=FRL6q8rT7nC'; // Province
		$url .= '&dimension=pC8BBR3B0XX'; // District
		$url .= '&dimension=wwT2BLUXNS3'; // Sex
		$url .= '&dimension=caMyqMax9y7-ikO7uhXGPCF'; // Age group
		$url .= '&filter=eHZ62Y25h0e:IN:'.$disease; // Filter disease
		$url .= '&filter=ou:cCTQiGkKcTk'; // Filter OU, Nepal
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT';
		$url .= '&startDate='.$sDate.'&endDate='.$eDate; // Start date and end date
		$url .= '&outputIdScheme=NAME';
		
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if($_GET['type'] == "outcome" && isset($_GET['sDate']) && isset($_GET['eDate']) && isset($_GET['disease'])){
		$sDate = $_GET['sDate'];
		$eDate = $_GET['eDate'];
		$disease = $_GET['disease'];
		
		$url = $dhisApiUrl.'analytics/events/aggregate/eo0mQLv7sNH.json?';
		$url .= 'dimension=ou:LEVEL-1;cCTQiGkKcTk';
		$url .= '&dimension=kud3hEOXtEB';
		$url .= '&dimension=VKeoG5LizrA';
		$url .= '&filter=eHZ62Y25h0e:IN:'.$disease; // Filter disease
		$url .= '&stage=Y01WDG6s69m&displayProperty=NAME&outputType=EVENT';
		$url .= '&startDate='.$sDate.'&endDate='.$eDate; // Start date and end date
		$url .= '&outputIdScheme=NAME';
		
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
		
	}else if($_GET['type'] == "outcomeDay" && isset($_GET['sDate']) && isset($_GET['eDate']) && isset($_GET['disease'])){
		$eDate = $_GET['eDate'];
		$disease = $_GET['disease'];
		
		$url = $dhisApiUrl.'analytics/events/aggregate/eo0mQLv7sNH.json?';
		$url .= 'dimension=ou:LEVEL-1;cCTQiGkKcTk';
		$url .= '&dimension=kud3hEOXtEB';
		$url .= '&dimension=VKeoG5LizrA';
		$url .= '&filter=eHZ62Y25h0e:IN:'.$disease; // Filter disease
		$url .= '&stage=Y01WDG6s69m&displayProperty=NAME&outputType=EVENT';
		$url .= '&startDate='.$eDate.'&endDate='.$eDate; // Start date and end date
		$url .= '&outputIdScheme=NAME';
		
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
		
	}else if($_GET['type'] == "day" && isset($_GET['eDate']) && isset($_GET['disease'])){
		$eDate = $_GET['eDate'];
		$disease = $_GET['disease'];
		
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?';
		$url .= 'dimension=FRL6q8rT7nC'; // Province
		$url .= '&dimension=pC8BBR3B0XX'; // District
		$url .= '&dimension=wwT2BLUXNS3'; // Sex
		$url .= '&dimension=caMyqMax9y7-ikO7uhXGPCF'; // Age group
		$url .= '&filter=eHZ62Y25h0e:IN:'.$disease; // Filter disease
		$url .= '&filter=ou:cCTQiGkKcTk'; // Filter OU, Nepal
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT';
		$url .= '&startDate='.$eDate.'&endDate='.$eDate; // Start date and end date
		$url .= '&outputIdScheme=NAME';
		
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
		
	}else if(isset($_GET['type']) && $_GET['type'] == "summary"){
		$adminLevel = $_GET['adminLevel'];
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?dimension=pe:TODAY;YESTERDAY;THIS_YEAR&dimension=cKzz4abGMmu&dimension=FRL6q8rT7nC&filter=ou:cCTQiGkKcTk';
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if(isset($_GET['type']) && $_GET['type'] == "summary2"){
		$adminLevel = $_GET['adminLevel'];
		
		$url = $dhisApiUrl.'analytics.json?dimension=dx:eo0mQLv7sNH.kud3hEOXtEB;eo0mQLv7sNH.VKeoG5LizrA&dimension=pe:TODAY;THIS_YEAR&filter=ou:cCTQiGkKcTk';
		$url .= '&displayProperty=NAME&aggregationType=SUM&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url, $auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if(isset($_GET['type']) && $_GET['type'] == "nationalMap"){
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?dimension=pC8BBR3B0XX&dimension=FRL6q8rT7nC&filter=ou:cCTQiGkKcTk&filter=pe:THIS_YEAR';
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url,$auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if(isset($_GET['type']) && $_GET['type'] == "charts"){
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?dimension=caMyqMax9y7-ikO7uhXGPCF&dimension=FRL6q8rT7nC&dimension=pC8BBR3B0XX&dimension=wwT2BLUXNS3&filter=ou:cCTQiGkKcTk&filter=pe:THIS_YEAR';
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url,$auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if(isset($_GET['type']) && $_GET['type'] == "weekly"){
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?dimension=pe:LAST_52_WEEKS&dimension=FRL6q8rT7nC&filter=ou:cCTQiGkKcTk';
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url,$auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else if(isset($_GET['type']) && $_GET['type'] == "last_14_days"){
		$pe = $_GET['period'];
	
		$url = $dhisApiUrl.'analytics/events/aggregate/Q8CmL8zkSSP.json?dimension=pe:'.$pe.'&dimension=FRL6q8rT7nC&filter=ou:cCTQiGkKcTk';
		$url .= '&stage=pssiuvRcFM0&displayProperty=NAME&outputType=EVENT&outputIdScheme=NAME';
		$auth = auth_dhis2();
		$result = get($url,$auth);
		$finalData = processData($result);
		print_r(json_encode($finalData));
		
	}else{
		$today = date("Y-m-d");
		$yesterday = date("Y-m-d", strtotime('-1 day', strtotime(date("Y-m-d"))));
		$date = array('today' => $today, 'yesterday' => $yesterday);
		print_r(json_encode($date));
		//exit('Sorry, could not process your request!');
	}
	
	function get($url,$auth){
		$username = $auth['username'];
		$password = $auth['password'];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
		$result = curl_exec ($ch);
		if(!curl_errno($ch)){
			$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		}	
		curl_close ($ch);
		$data = json_decode($result, true);
		return $data;
	}
	
	function post($url, $json,$auth){
		$username = $auth['username'];
		$password = $auth['password'];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			'Content-Type: application/json',                                                                                
			'Content-Length: ' . strlen($json))                                                                       
		);
		curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
		$result = curl_exec ($ch);
		if(!curl_errno($ch)){
			$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		}	
		curl_close ($ch);
		$data = json_decode($result, true);
		return json_encode($data);
	}
	
	function processData($result){
		$headers = $result['headers'];
		$meta = $result['metaData']['items'];
		$finalData = [];
		
		foreach($result['rows'] as $index => $row){
			$temp = [];
			foreach($row as $i => $r){
				$value = "";
				if($headers[$i]['column'] == 'Outcome'){
					if($r == 'Under Treatment' || $r == 'Under_Treatment'){
						$value = 'Active';
					}else{
						$value = $r;
					}
				}else if($headers[$i]['column'] == 'Age' || $headers[$i]['column'] == 'Organisation unit'){
					$value = $meta[$r]['name'];
				}else if($headers[$i]['column'] == 'Period'){
					$yesterday = str_replace('-','',date("Y-m-d", strtotime('-1 day', strtotime(date("Y-m-d")))));
					$yesterdayDate = date("Y-m-d", strtotime('-1 day', strtotime(date("Y-m-d"))));
					if($r == str_replace('-','',date("Y-m-d")) || $r == date("Y-m-d")){
						$value = 'Today';
					}else if($r == $yesterday || $r == $yesterdayDate){
						$value = 'Yesterday';
					}else{
						$value = $r;
					}
					
					if($_GET['type'] == "last_14_days"){
						$value = $meta[$r]['name'];
					}
				}else if($headers[$i]['column'] == 'District'){
					$value = $r;
				}else{
					$value = $r;
				}
				
				$temp[$headers[$i]['column']] = $value;
			}
			array_push($finalData, $temp);
		}
		
		return $finalData;
	}
	
	function auth_dhis2(){
		$auth = [];
		$auth['username'] = 'username';
		$auth['password'] = 'password';
		return $auth;
	}
?>