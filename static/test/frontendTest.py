import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.common.exceptions import NoSuchElementException

'''
# TODO1: when logged in, login and register button under settings will disappear
# TODO2: when logged in, name of user should appear
# TODO3: register a test account -> test sign in
# TODO4: next to the word president has a comma, it is clickable to login with admin

test account:
email: test1@email.com
first name: test_first
last name: test_last
password: !1234567Aa
'''


class frontendTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    '''Supporting functions'''

    # supporting function to enter username and password
    def username_password(self, username_input, password_input):
        driver = self.driver
        driver.get("https://alpha-holding.herokuapp.com/")
        time.sleep(5)

        # get icon for chat
        chat_icon = driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        # check whether the when the chat icon is pressed, the style should change
        assert int(driver.find_elements_by_css_selector(
            '.chat')[0].value_of_css_property('opacity')) == 1
        time.sleep(3)

        # click for card replacement
        card_replacement = driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        # click for yes please
        yes_please = driver.find_element_by_xpath(
            '//*[@id="cd-0"]')
        yes_please.click()
        time.sleep(3)

        # click to sign in
        sign_in = driver.find_element_by_xpath(
            '//*[@id="resignin-5"]')
        sign_in.click()
        time.sleep(3)

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.send_keys(username_input)
        password.send_keys(password_input)
        time.sleep(3)

        driver.find_element_by_xpath('//*[@id="login_btn"]').click()
        time.sleep(3)

    # alert will pop up for those who have not registered
    def alert_register(self):
        alert = self.driver.find_element_by_xpath('//*[@id="alertLogin"]')
        time.sleep(3)
        self.assertIsNotNone(
            self.driver.find_element_by_id('signInRegisterBtn'))

    # accept alert
    def accept_alert(self):
        alert_obj = self.driver.switch_to.alert
        time.sleep(3)
        alert_obj.accept()
        time.sleep(5)

    # check whether logout appears and login and signin disappears
    def logout_appears_login_disappears(self):
        logout = self.driver.find_element_by_xpath('//*[@id="quit"]')
        time.sleep(1)
        self.assertIsNotNone(logout)

        # register button should not exist
        try:
            register = self.driver.find_element_by_xpath('//*[@id="register"]')
        except NoSuchElementException:
            return False

            # login button should not exist
        try:
            login = self.driver.find_element_by_xpath('//*[@id="login"]')
        except NoSuchElementException:
            return False

    # username will appear after login
    def top_left_name(self):
        top_name = self.driver.find_element_by_xpath(
            '//*[@id="titleText"]').text
        self.assertEqual(top_name, "test_first test_last")

    # chat name should be username instead of 'Guest' when login
    def chat_name(self):
        # get icon for chat
        chat_icon = self.driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        # click for card replacement
        card_replacement = self.driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        # check chat name
        name = self.driver.find_element_by_xpath(
            '//*[@id="conversation_body"]/div[2]/span[1]').text
        self.assertEqual(name, "test_first test_last")

    '''Testing'''

    def test_username_password1(self):
        self.username_password('test1', 'test1')
        self.alert_register()

    def test_username_password2(self):
        self.username_password('', '')

    def test_username_password3(self):
        self.username_password('%ssomething', '%d1234')
        self.alert_register()

    def test_login1(self):
        self.username_password('test1@email.com', '!1234567Aa')
        self.accept_alert()
        self.logout_appears_login_disappears()
        self.top_left_name()
        self.chat_name()

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
