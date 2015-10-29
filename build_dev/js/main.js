////////////////////////
// Test Application JS
////////////////////////
window.Quizzer = (function(){
	
	// Module container
	var module = {};

	// Private variables
	var Questions = {};
	var ActualQuestion = 0;

	// Public functions
	module.init = function(){
		_initializeApp();
		_initializeStartView();
	};

	// Private functions
	function _initializeApp(){
		_initTemplateConfig();
		_initAjaxConfig();
	}

	function _initializeStartView(){
		_renderStartView();
	}

	function _initializeTestView(){
		// Clean test variables
		_clearTestVariables();
		// Load question list
		_loadQuestionList().then(
			// on Success
			function(data){
				// Pass data to variable
				Questions = data;
				// Render test view
				_renderTestView( Questions[ActualQuestion] );
			},
			// on Error
			function(err){
				// Render error view
				_renderErrorView();
			});
	}

	function _initializeResultsView(){
		_renderResultsView();
	}

	function _renderTestView(question){
		// Get testView
		var questionTemplate = _.template( $("#testView").html() );
		// Clear view
		_clearAppView();
		// Set testView with Question List Data
		_renderAppView( questionTemplate( question ));
		// Initialize Test view controls
		_initTestViewControls();
	}

	function _renderErrorView(){
		_clearAppView();
		_renderAppView( $("#errorView").html() );
		_initErrorViewControls();
	}

	function _renderStartView(){
		_clearAppView();
		_renderAppView( $("#startView").html() );
		_initStartViewControls();
	}

	function _renderResultsView(){
		var resultsTemplate = _.template( $("#resultsView").html() );
		_clearAppView();
		_renderAppView( resultsTemplate( Questions ) );
		_initResultsViewControls();
	}

	function _initTemplateConfig(){
		_.templateSettings.variable = "rc";
	}

	function _initAjaxConfig(){
		// Override MimeType for the browser not to see the .json 
		// with a syntax error
		$.ajaxSetup({'beforeSend': function(xhr){
		    if (xhr.overrideMimeType)
		        xhr.overrideMimeType("text/plain");
		    }
		});
	}

	function _initStartViewControls(){
		$( "#Start" ).on("click", _onStartClick);
	}

	function _initTestViewControls(){
		// Set controls behavior
		$( ".answers-holder a" ).on("click", _onAnswerClick);
		$( "#Before" ).on("click", _onBeforeClick);
		$( "#Next" ).on("click", _onNextClick);

		// If it's the first question
		if(ActualQuestion == 0)
			_disableControl("#Before");

		// If it's the last question
		if(ActualQuestion == Questions.length - 1){
			$("#Next").text("Finish");
			$("#Next").addClass("finish");
		}			
	}

	function _initResultsViewControls(){
		$("#Continue").on("click", _onContinue);
		$("#appPoints em").text( _calculateScore() );
	}

	function _initErrorViewControls(){
		$("#Return").on("click", _onContinue);
	}

	function _loadQuestionList(){
		return $.getJSON("test.json");
	} 

	function _calculateScore(){
	 	var score = 0;
		for (var i=0, j = Questions.length; i < j; i++)
			if(Questions[i].Correct == Questions[i].State)
				score++;
		return score;
	}
	
	function _onStartClick(){
		_initializeTestView();
	}

	function _onAnswerClick(){
		// Change appearance of selected button
		_uncheckSelected();
		_checkSelected(this);

		// Change state of Actual answer
		Questions[ActualQuestion].State = $(this).attr("value");

		// Advance to the next question (if possible)
		_nextQuestion();
	}

	function _onBeforeClick(){
		_previousQuestion();
	}

	function _onNextClick(){
		if(ActualQuestion != Questions.length - 1)
			_nextQuestion();
		else
			_onFinish();
	}

	function _onFinish(){
		_initializeResultsView();
	}

	function _onContinue(){
		_initializeStartView();
	}

	function _uncheckSelected(){
		$(".answers-holder a").removeClass("selected");
	}

	function _checkSelected(control){
		$(control).addClass("selected");
	}

	function _nextQuestion(){
		// If "ActualQuestion" is lower than number of questions
		if(ActualQuestion < Questions.length - 1){
			// Increase actual question counter
			ActualQuestion++;
			// Load template with actual question
			_renderTestView( Questions[ActualQuestion] );
			// Re-select answer if selected
			_selectCurrentState();
		}
	}

	function _previousQuestion(){
		// If "ActualQuestion" is higher than 0
		if(ActualQuestion > 0){
			// Increase actual question counter
			ActualQuestion--;
			// Load template with actual question
			_renderTestView( Questions[ActualQuestion] );
			// Re-select answer if selected
			_selectCurrentState();
		}
	}

	function _selectCurrentState(){
		var currentState = Questions[ActualQuestion].State;
		if(currentState != -1){
			_uncheckSelected();
			_checkSelected("#Answer" + currentState);
		}
	}

	// Auxiliary functions
	function _disableControl(control){
		$(control).attr('disabled', true);
	}

	function _enableControl(control){
		$(control).attr('disabled', false);
	}

	function _clearAppView(){
		$("#appBody").empty();
	}

	function _renderAppView(view){
		$("#appBody").append(view);
	}

	function _clearTestVariables(){
		Questions = {};
		ActualQuestion = 0;
	}

	// Call initializer function
	module.init();

	// Return module to window.Quizzer
	return module;

})();